#!/usr/bin/env python3
"""Walk the Penpot .pen JSON to extract every design token used."""
import json
from collections import Counter
from pathlib import Path

DATA = json.loads(Path(__file__).parent.joinpath("of-v2.pen").read_text())

colors = Counter()
fonts = Counter()
font_sizes = Counter()
font_weights = Counter()
font_families = Counter()
radii = Counter()
shadows = Counter()
strokes = Counter()
gaps = Counter()
paddings = Counter()


def add_color(c):
    if not c:
        return
    if isinstance(c, str):
        colors[c.upper()] += 1
    elif isinstance(c, dict):
        v = c.get("color") or c.get("fill")
        if v:
            colors[str(v).upper()] += 1


def walk(node, depth=0):
    if not isinstance(node, dict):
        return
    t = node.get("type")
    fill = node.get("fill")
    add_color(fill)

    fills = node.get("fills")
    if isinstance(fills, list):
        for f in fills:
            if isinstance(f, dict):
                add_color(f.get("color") or f.get("fill"))

    stroke = node.get("stroke") or node.get("strokeColor")
    if stroke:
        strokes[str(stroke).upper()] += 1

    if "borderRadius" in node:
        radii[str(node["borderRadius"])] += 1
    if "borderRadiusTopLeft" in node:
        radii[str(node["borderRadiusTopLeft"])] += 1

    if "shadow" in node:
        shadows[json.dumps(node["shadow"]) if not isinstance(node["shadow"], str) else node["shadow"]] += 1

    if "padding" in node:
        p = node["padding"]
        if isinstance(p, list):
            paddings[tuple(p)] += 1
        else:
            paddings[(p,)] += 1

    if "gap" in node:
        gaps[str(node["gap"])] += 1

    if t == "text":
        for k in ("fontFamily", "font_family"):
            v = node.get(k)
            if v:
                font_families[v] += 1
        for k in ("fontSize", "font_size"):
            v = node.get(k)
            if v:
                font_sizes[str(v)] += 1
        for k in ("fontWeight", "font_weight"):
            v = node.get(k)
            if v:
                font_weights[str(v)] += 1
        ff = node.get("font")
        if ff:
            fonts[str(ff)] += 1
        # Penpot sometimes nests text in `content` / `runs`
        for runs_key in ("runs", "content"):
            r = node.get(runs_key)
            if isinstance(r, list):
                for run in r:
                    if isinstance(run, dict):
                        if "fontFamily" in run:
                            font_families[run["fontFamily"]] += 1
                        if "fontSize" in run:
                            font_sizes[str(run["fontSize"])] += 1
                        if "fontWeight" in run:
                            font_weights[str(run["fontWeight"])] += 1
                        if "fill" in run:
                            add_color(run["fill"])
                        if "color" in run:
                            add_color(run["color"])
            elif isinstance(r, dict):
                walk(r, depth + 1)

    for c in node.get("children", []) or []:
        walk(c, depth + 1)


for top in DATA.get("children", []):
    walk(top)


def show(title, counter, n=40):
    print(f"\n=== {title} ({len(counter)} unique) ===")
    for k, v in counter.most_common(n):
        print(f"  {v:4d}  {k}")


show("Colors (fills + text)", colors, 60)
show("Strokes", strokes, 30)
show("Border radii", radii, 30)
show("Font families", font_families, 20)
show("Font sizes", font_sizes, 40)
show("Font weights", font_weights, 20)
show("Padding patterns (top, right, bottom, left)", paddings, 30)
show("Gap values", gaps, 30)
show("Shadows", shadows, 20)
