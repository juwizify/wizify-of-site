#!/usr/bin/env python3
"""Extract a single page (by frame name) from the .pen and dump its full structure
with positions, paddings, gaps, fills, fonts, and text contents."""
import json
import sys
from pathlib import Path

DATA = json.loads(Path(__file__).parent.joinpath("of-v2.pen").read_text())

PAGE_NAME = sys.argv[1] if len(sys.argv) > 1 else "OF — Accueil"


def find_page(nodes, name):
    for n in nodes:
        if n.get("name") == name:
            return n
    return None


def text_of(node):
    if not isinstance(node, dict):
        return ""
    parts = []
    c = node.get("content")
    if isinstance(c, str):
        parts.append(c)
    elif isinstance(c, list):
        for x in c:
            if isinstance(x, dict) and "text" in x:
                parts.append(x["text"])
            elif isinstance(x, str):
                parts.append(x)
    elif isinstance(c, dict):
        # nested paragraph/run structure
        def rec(n):
            if not isinstance(n, dict):
                return
            if "text" in n and isinstance(n["text"], str):
                parts.append(n["text"])
            for k in ("children", "runs"):
                kids = n.get(k)
                if isinstance(kids, list):
                    for kk in kids:
                        rec(kk)
        rec(c)
    if "text" in node and isinstance(node["text"], str):
        parts.append(node["text"])
    return "".join(parts).strip()


def fmt_node(n, depth=0, max_depth=12):
    if depth > max_depth:
        return
    indent = "  " * depth
    t = n.get("type", "?")
    name = n.get("name", "")
    bits = [f"[{t}]", name]
    for k in ("x", "y", "width", "height"):
        if k in n:
            v = n[k]
            if isinstance(v, (int, float)):
                bits.append(f"{k}={v:g}")
            else:
                bits.append(f"{k}={v}")
    if "fill" in n:
        bits.append(f"fill={n['fill']}")
    if "padding" in n:
        bits.append(f"pad={n['padding']}")
    if "gap" in n:
        bits.append(f"gap={n['gap']}")
    if "cornerRadius" in n:
        bits.append(f"r={n['cornerRadius']}")
    if "layout" in n:
        bits.append(f"layout={n['layout']}")
    for k in ("layoutAlign", "alignSelf", "alignItems", "justifyContent", "flexWrap", "alignContent"):
        if k in n:
            bits.append(f"{k}={n[k]}")
    if "stroke" in n and isinstance(n["stroke"], dict):
        s = n["stroke"]
        bits.append(f"stroke={s.get('FILL', '?')}@{s.get('THICKNESS', '?')}")
    if "effect" in n and isinstance(n["effect"], dict):
        e = n["effect"]
        bits.append(f"shadow=blur:{e.get('blur')}/{e.get('color')}")

    txt = text_of(n)
    if txt:
        bits.append(f"text={json.dumps(txt[:600])}")

    if t == "text":
        for k in ("fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "textAlign"):
            if k in n:
                bits.append(f"{k}={n[k]}")
        # text run-level styles
        for runs_key in ("runs", "content"):
            r = n.get(runs_key)
            if isinstance(r, dict):
                for c in r.get("children", []):
                    walk_text_runs(c, bits)

    print(indent + " ".join(str(b) for b in bits))
    for c in n.get("children", []) or []:
        fmt_node(c, depth + 1, max_depth)


def walk_text_runs(c, bits):
    if not isinstance(c, dict):
        return
    if "fontSize" in c or "fontWeight" in c or "fill" in c:
        sig = []
        for k in ("fontSize", "fontWeight", "fill"):
            if k in c:
                sig.append(f"{k}={c[k]}")
        if sig:
            bits.append("run(" + ",".join(sig) + ")")
    for cc in c.get("children", []) or []:
        walk_text_runs(cc, bits)


page = find_page(DATA["children"], PAGE_NAME)
if not page:
    print(f"Page not found: {PAGE_NAME}")
    print("Available:", [c.get("name") for c in DATA["children"]])
    sys.exit(1)

fmt_node(page, 0, 14)
