#!/usr/bin/env python3
"""Generate a TSX component pixel-perfect from a Penpot v2 .pen JSON page.

Usage:
    python3 design/generate.py "OF — Accueil"        # writes src/generated/OFAccueil.tsx
    python3 design/generate.py --list                  # list available pages

Approach: walk the Penpot tree, emit one JSX element per node with INLINE styles
computed verbatim from JSON fields. Zero Tailwind, zero interpretation.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
PEN_FILE = ROOT / "of-v2.pen"
ICON_MAP = json.loads((ROOT / "icon_mapping.json").read_text())
LINK_MAP = json.loads((ROOT / "link_map.json").read_text())
OUT_DIR = ROOT.parent / "src" / "generated"


def lookup_href(node: dict) -> str | None:
    """Return an href if this node should be a link, else None."""
    name = node.get("name")
    if name and name in LINK_MAP.get("by_name", {}):
        return LINK_MAP["by_name"][name]
    if node.get("type") == "text":
        content = (node.get("content") or "").strip()
        if content and content in LINK_MAP.get("by_text", {}):
            return LINK_MAP["by_text"][content]
    return None

# id -> node, lazily populated for ref expansion
_REUSABLES: dict[str, dict] = {}


def index_reusables(data: dict) -> None:
    _REUSABLES.clear()
    for c in data.get("children", []) or []:
        if isinstance(c, dict) and c.get("reusable") and c.get("id"):
            _REUSABLES[c["id"]] = c


def merge_overrides(node: dict, descendants: dict | None) -> dict:
    """Return a copy of `node` with descendants[node.id] fields merged on top.
    Recursively walks children so all overrides apply."""
    if not isinstance(node, dict):
        return node
    nid = node.get("id")
    overrides = descendants.get(nid) if descendants and nid else None
    out = dict(node)
    if overrides:
        out.update(overrides)
    if "children" in out and isinstance(out["children"], list):
        out["children"] = [merge_overrides(c, descendants) for c in out["children"]]
    return out


# ---------- helpers ----------

def slugify(name: str) -> str:
    # transliterate accents → ASCII before stripping non-alphanumerics
    repl = str.maketrans({
        "à": "a", "â": "a", "ä": "a",
        "é": "e", "è": "e", "ê": "e", "ë": "e",
        "î": "i", "ï": "i",
        "ô": "o", "ö": "o",
        "ù": "u", "û": "u", "ü": "u",
        "ç": "c", "ÿ": "y",
        "À": "A", "Â": "A", "Ä": "A",
        "É": "E", "È": "E", "Ê": "E", "Ë": "E",
        "Î": "I", "Ï": "I",
        "Ô": "O", "Ö": "O",
        "Ù": "U", "Û": "U", "Ü": "U",
        "Ç": "C",
    })
    s = name.translate(repl).replace("—", " ").replace("&", " ")
    n = re.sub(r"[^A-Za-z0-9]+", "", s)
    if n and n[0].isdigit():
        n = "X" + n
    return n or "Anon"


def jsx_str(s: str) -> str:
    """Render a string as a JSX text child (escapes braces, &, <, >)."""
    return (s
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("{", "&#123;")
            .replace("}", "&#125;"))


def js_str(s: str) -> str:
    """Render a string as a JS string literal."""
    return json.dumps(s, ensure_ascii=False)


def px(v) -> str:
    if isinstance(v, (int, float)):
        # render integers without decimal
        if float(v).is_integer():
            return f"{int(v)}px"
        return f"{v}px"
    return str(v)


def color_to_css(c: str) -> str:
    """Penpot colors are #RRGGBB or #RRGGBBAA. CSS accepts both."""
    return c if c.startswith("#") else c


# ---------- style builder ----------

def parent_is_horizontal_with_zero_v_padding(parent: dict | None) -> bool:
    """Penpot pattern: nav-style horizontal container (height set, no v padding,
    alignItems center). Direct children should stretch to full parent height."""
    if not parent:
        return False
    layout = parent.get("layout")
    if layout not in ("horizontal", None):
        return False
    if not isinstance(parent.get("height"), (int, float)):
        return False
    p = parent.get("padding")
    top = bot = 0
    if isinstance(p, list):
        if len(p) == 2:
            top = bot = p[0]
        elif len(p) == 4:
            top, bot = p[0], p[2]
        elif len(p) == 1:
            top = bot = p[0]
    return top == 0 and bot == 0 and parent.get("alignItems") == "center"


def style_for_frame(node: dict, parent: dict | None) -> dict:
    """Compute the CSS style object for a frame node."""
    s: dict[str, str] = {}
    parent_layout = (parent or {}).get("layout") if parent else None

    # display
    layout = node.get("layout")
    if layout == "vertical":
        s["display"] = "flex"
        s["flexDirection"] = "column"
    elif layout == "horizontal":
        s["display"] = "flex"
        s["flexDirection"] = "row"
    elif layout == "none":
        s["position"] = "relative"
    elif "children" in node and node.get("children"):
        # default frame with children = horizontal flex (Penpot's default)
        s["display"] = "flex"
        s["flexDirection"] = "row"

    # dimensions
    w = node.get("width")
    h = node.get("height")
    if w == "fill_container":
        if parent_layout == "vertical":
            s["width"] = "100%"
            s["alignSelf"] = "stretch"
        elif parent_layout in ("horizontal", None):
            # in a horizontal flex parent, fill_container = grow to equal share
            s["flex"] = "1 1 0"
            s["minWidth"] = "0"
        else:
            s["width"] = "100%"
    elif isinstance(w, (int, float)):
        s["width"] = px(w)

    if h == "fill_container":
        if parent_layout == "horizontal" or parent_layout is None:
            s["alignSelf"] = "stretch"
        elif parent_layout == "vertical":
            s["flex"] = "1 1 0"
            s["minHeight"] = "0"
    elif isinstance(h, (int, float)):
        s["height"] = px(h)
    else:
        # Nav-pattern stretch: child of horizontal container with explicit
        # height + zero vertical padding → fill full parent height (e.g. nav CTA)
        # Only stretch frames with their own background or border — text/link
        # spans don't need this, but visual chrome does.
        if (parent_is_horizontal_with_zero_v_padding(parent)
                and (node.get("fill") or node.get("stroke"))):
            s["alignSelf"] = "stretch"

    # absolute positioning if parent has layout=none
    if parent_layout == "none":
        s["position"] = "absolute"
        if "x" in node:
            s["left"] = px(node["x"])
        if "y" in node:
            s["top"] = px(node["y"])

    # padding
    p = node.get("padding")
    if isinstance(p, list):
        if len(p) == 1:
            s["padding"] = px(p[0])
        elif len(p) == 2:
            # [v, h] shorthand
            s["padding"] = f"{px(p[0])} {px(p[1])}"
        elif len(p) == 4:
            s["padding"] = " ".join(px(x) for x in p)

    # gap
    if "gap" in node:
        s["gap"] = px(node["gap"])

    # border-radius
    cr = node.get("cornerRadius")
    if isinstance(cr, list):
        s["borderRadius"] = " ".join(px(x) for x in cr)
    elif isinstance(cr, (int, float)):
        s["borderRadius"] = px(cr)

    # background
    fill = node.get("fill")
    if isinstance(fill, str):
        s["background"] = color_to_css(fill)

    # alignItems / justifyContent
    # Penpot default alignItems is "start" for vertical (content-sized children),
    # but for horizontal grids the visual intent is equal-height cards (CSS stretch).
    # We mirror that:
    #   - vertical flex, no Penpot alignItems → flex-start (content-sized)
    #   - horizontal flex, no Penpot alignItems → stretch (default CSS, equal heights)
    if s.get("display") == "flex":
        if "alignItems" in node:
            v = node["alignItems"]
            s["alignItems"] = {"start": "flex-start", "end": "flex-end"}.get(v, v)
        elif s.get("flexDirection") == "column":
            s["alignItems"] = "flex-start"
        # else: horizontal — leave alignItems unset (CSS stretch default)
    if "justifyContent" in node:
        v = node["justifyContent"]
        s["justifyContent"] = {
            "space_between": "space-between",
            "space_around": "space-around",
            "space_evenly": "space-evenly",
            "start": "flex-start",
            "end": "flex-end",
        }.get(v, v)

    # stroke -> border (align: inside means border-box, which is default)
    stroke = node.get("stroke")
    if isinstance(stroke, dict):
        thickness = stroke.get("thickness", 0)
        if thickness:
            color = stroke.get("fill", "#000000")
            s["border"] = f"{thickness}px solid {color}"
        # else: thickness 0 = no border, skip

    # effect -> box-shadow
    eff = node.get("effect")
    if isinstance(eff, dict) and eff.get("type") == "shadow":
        offset = eff.get("offset") or {}
        ox = offset.get("x", 0) or 0
        oy = offset.get("y", 0) or 0
        blur = eff.get("blur", 0)
        color = eff.get("color", "#00000020")
        s["boxShadow"] = f"{px(ox)} {px(oy)} {px(blur)} {color_to_css(color)}"

    # clip
    if node.get("clip"):
        s["overflow"] = "hidden"

    return s


def style_for_text(node: dict, parent: dict | None) -> dict:
    s: dict[str, str] = {}
    parent_layout = (parent or {}).get("layout") if parent else None

    if "fontFamily" in node:
        s["fontFamily"] = node["fontFamily"]
    if "fontSize" in node:
        s["fontSize"] = px(node["fontSize"])
    fw = node.get("fontWeight")
    if fw is not None and fw != "normal":
        s["fontWeight"] = str(fw)
    elif fw == "normal":
        s["fontWeight"] = "400"
    if "letterSpacing" in node:
        s["letterSpacing"] = px(node["letterSpacing"])
    if "lineHeight" in node:
        lh = node["lineHeight"]
        s["lineHeight"] = str(lh)
    if "textAlign" in node:
        s["textAlign"] = node["textAlign"]
    fill = node.get("fill")
    if isinstance(fill, str):
        s["color"] = color_to_css(fill)

    w = node.get("width")
    if w == "fill_container":
        if parent_layout == "vertical":
            s["width"] = "100%"
        elif parent_layout in ("horizontal", None):
            s["flex"] = "1 1 0"
            s["minWidth"] = "0"
    elif isinstance(w, (int, float)):
        s["width"] = px(w)

    if parent_layout == "none":
        s["position"] = "absolute"
        if "x" in node: s["left"] = px(node["x"])
        if "y" in node: s["top"] = px(node["y"])

    return s


def style_for_simple(node: dict, parent: dict | None) -> dict:
    """rectangle / ellipse / icon_font."""
    s: dict[str, str] = {}
    parent_layout = (parent or {}).get("layout") if parent else None

    w = node.get("width")
    h = node.get("height")
    if w == "fill_container":
        if parent_layout == "vertical":
            s["width"] = "100%"
        else:
            s["flex"] = "1 1 0"
            s["minWidth"] = "0"
    elif isinstance(w, (int, float)):
        s["width"] = px(w)
    if isinstance(h, (int, float)):
        s["height"] = px(h)

    if parent_layout == "none":
        s["position"] = "absolute"
        if "x" in node: s["left"] = px(node["x"])
        if "y" in node: s["top"] = px(node["y"])

    fill = node.get("fill")
    if isinstance(fill, str):
        if node.get("type") == "icon_font":
            s["color"] = color_to_css(fill)
        else:
            s["background"] = color_to_css(fill)

    if node.get("type") == "ellipse":
        s["borderRadius"] = "50%"
    return s


# ---------- icon resolution ----------

USED_LUCIDE: set[str] = set()
USED_LOCAL: set[str] = set()


def resolve_icon(node: dict) -> str:
    family = node.get("iconFontFamily", "lucide")
    name = node.get("iconFontName", "")
    if family == "lucide":
        comp = ICON_MAP["lucide"].get(name)
    elif "Material" in family:
        comp = ICON_MAP["material_symbols_rounded"].get(name)
    else:
        comp = None
    if not comp:
        comp = "HelpCircle"
    if comp.endswith("@local"):
        comp = comp.removesuffix("@local")
        USED_LOCAL.add(comp)
    else:
        USED_LUCIDE.add(comp)
    return comp


# ---------- emitter ----------

def style_dict_to_jsx(s: dict) -> str:
    if not s:
        return ""
    parts = []
    for k, v in s.items():
        parts.append(f"{k}: {js_str(str(v))}")
    return "{{ " + ", ".join(parts) + " }}"


def emit(node: dict, parent: dict | None, indent: int = 0, inside_link: bool = False) -> list[str]:
    pad = "  " * indent
    t = node.get("type")
    name = node.get("name", "")
    out: list[str] = []

    href = None if inside_link else lookup_href(node)
    href_attr = f' href={js_str(href)}' if href else ""

    if t == "frame":
        s = style_for_frame(node, parent)
        if href:
            # anchors inherit color + remove default underline so the design tokens stay authoritative
            s.setdefault("textDecoration", "none")
            s.setdefault("color", "inherit")
        data_name = f' data-name={js_str(name)}' if name else ""
        children = node.get("children") or []
        tag = "a" if href else "div"
        if not children:
            out.append(f'{pad}<{tag}{href_attr}{data_name} style={style_dict_to_jsx(s)} />')
        else:
            out.append(f'{pad}<{tag}{href_attr}{data_name} style={style_dict_to_jsx(s)}>')
            if name and "[CMS:" in name:
                out.append(f'{pad}  {{/* {name} */}}')
            for c in children:
                out.extend(emit(c, node, indent + 1, inside_link or bool(href)))
            out.append(f'{pad}</{tag}>')
    elif t == "text":
        s = style_for_text(node, parent)
        content = node.get("content", "")
        if href:
            s.setdefault("textDecoration", "none")
            s.setdefault("color", s.get("color", "inherit"))
        tag = "a" if href else "span"
        if "\n" in content:
            if "whiteSpace" not in s:
                s["whiteSpace"] = "pre-line"
            out.append(f'{pad}<{tag}{href_attr} style={style_dict_to_jsx(s)}>{{{js_str(content)}}}</{tag}>')
        else:
            out.append(f'{pad}<{tag}{href_attr} style={style_dict_to_jsx(s)}>{jsx_str(content)}</{tag}>')
    elif t == "rectangle":
        s = style_for_simple(node, parent)
        out.append(f'{pad}<div style={style_dict_to_jsx(s)} />')
    elif t == "ellipse":
        s = style_for_simple(node, parent)
        out.append(f'{pad}<div style={style_dict_to_jsx(s)} />')
    elif t == "icon_font":
        comp = resolve_icon(node)
        s = style_for_simple(node, parent)
        size = int(node.get("width") or 16)
        if comp in USED_LUCIDE:
            out.append(f'{pad}<{comp} size={{{size}}} strokeWidth={{2}} style={style_dict_to_jsx(s)} />')
        else:
            # local SVG component — only style props
            out.append(f'{pad}<{comp} style={style_dict_to_jsx(s)} />')
    elif t == "ref":
        target = _REUSABLES.get(node.get("ref"))
        if not target:
            out.append(f'{pad}{{/* unresolved ref to {node.get("ref")} */}}')
        else:
            # Inline-expand the reusable with descendant overrides + ref-level overrides
            expanded = merge_overrides(target, node.get("descendants") or {})
            # ref-level fields override the root (width, x, y, name)
            for k in ("width", "height", "x", "y", "name"):
                if k in node:
                    expanded[k] = node[k]
            out.append(f'{pad}{{/* ref: {node.get("name")} -> {target.get("name")} */}}')
            out.extend(emit(expanded, parent, indent, inside_link))
    elif t == "image":
        out.append(f'{pad}{{/* image: {node.get("url", "?")} */}}')
    else:
        out.append(f'{pad}{{/* unknown type: {t} */}}')
    return out


# ---------- top-level page generator ----------

HEADER_TEMPLATE = '''// AUTO-GENERATED by design/generate.py from design/of-v2.pen — do not edit by hand.
// Regenerate: cd wizify-of-site && python3 design/generate.py "{page_name}"

{icon_imports}

export default function {component_name}() {{
  return (
{body}
  );
}}
'''


def generate_page(page_name: str) -> str:
    data = json.loads(PEN_FILE.read_text())
    index_reusables(data)
    page = next((c for c in data.get("children", []) if c.get("name") == page_name), None)
    if not page:
        avail = [c.get("name") for c in data.get("children", [])]
        sys.exit(f"Page not found: {page_name}\nAvailable: {avail}")

    USED_LUCIDE.clear()
    USED_LOCAL.clear()

    body_lines = emit(page, None, indent=2)
    body = "\n".join(body_lines)

    imports = []
    if USED_LUCIDE:
        imports.append(f'import {{ {", ".join(sorted(USED_LUCIDE))} }} from "lucide-react";')
    if USED_LOCAL:
        imports.append(f'import {{ {", ".join(sorted(USED_LOCAL))} }} from "@/components/icons/Icons";')
    icon_imports = "\n".join(imports)

    component_name = slugify(page_name)
    return HEADER_TEMPLATE.format(
        page_name=page_name,
        icon_imports=icon_imports,
        component_name=component_name,
        body=body,
    )


def list_pages() -> None:
    data = json.loads(PEN_FILE.read_text())
    for c in data.get("children", []):
        if isinstance(c, dict) and c.get("type") == "frame":
            name = c.get("name", "?")
            print(f"  - {name}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("page", nargs="?", help='Frame name, e.g. "OF — Accueil"')
    p.add_argument("--list", action="store_true")
    p.add_argument("--all", action="store_true", help='Generate all pages with "OF — " prefix')
    p.add_argument("-o", "--out", help="Output path (default: src/generated/<Name>.tsx)")
    args = p.parse_args()

    if args.list:
        list_pages()
        return

    if args.all:
        data = json.loads(PEN_FILE.read_text())
        OUT_DIR.mkdir(parents=True, exist_ok=True)
        for c in data.get("children", []) or []:
            if not isinstance(c, dict) or c.get("type") != "frame":
                continue
            name = c.get("name", "")
            if not name.startswith("OF —"):
                continue
            code = generate_page(name)
            out_path = OUT_DIR / f"{slugify(name)}.tsx"
            out_path.write_text(code)
            print(f"Wrote {out_path.name} ({code.count(chr(10))} lines)")
        return

    if not args.page:
        list_pages()
        return

    code = generate_page(args.page)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = Path(args.out) if args.out else (OUT_DIR / f"{slugify(args.page)}.tsx")
    out_path.write_text(code)
    print(f"Wrote {out_path}  ({len(code)} bytes, {code.count(chr(10))} lines)")


if __name__ == "__main__":
    main()
