#!/usr/bin/env python3
"""
Radar Entry Analysis - No External Dependencies
This is a lightweight version that can be used when pyyaml is not available.
It provides basic analysis of radar entries without requiring external dependencies.
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple

# Base path for radar entries
RADAR_BASE_PATH = Path(__file__).parent.parent / "radar"
CATEGORIES = ["ai", "data_management", "dev", "infrastructure_ci_cd", "qa"]


def parse_yaml_simple(content: str) -> Dict:
    """
    Simple YAML parser that extracts key fields without external dependencies.
    Limited to the specific structure of radar entries.
    """
    data = {}
    lines = content.split('\n')
    current_key = None
    current_value = []
    in_multiline = False
    multiline_indent = 0

    for line in lines:
        if not line.strip() or line.strip().startswith('#'):
            continue

        # Check for multiline string indicator
        if '|' in line and ':' in line:
            key = line.split(':')[0].strip()
            in_multiline = True
            multiline_indent = len(line) - len(line.lstrip())
            current_key = key
            current_value = []
            continue

        # Handle multiline content
        if in_multiline:
            if line and (len(line) - len(line.lstrip())) <= multiline_indent and line.strip():
                # End of multiline block
                data[current_key] = '\n'.join(current_value).strip()
                in_multiline = False
                current_key = None
                current_value = []
            elif line.strip():
                current_value.append(line.lstrip())
                continue

        # Handle regular key-value pairs
        if ':' in line and not line.startswith(' ' * 2):
            parts = line.split(':', 1)
            if len(parts) == 2:
                key = parts[0].strip()
                value = parts[1].strip()
                if value and value != '|':
                    data[key] = value
                current_key = key

    return data


def load_radar_entries_simple() -> Dict[str, Dict]:
    """Load radar entries using simple parsing (no external deps)."""
    entries = {}

    for category in CATEGORIES:
        category_path = RADAR_BASE_PATH / category
        if not category_path.exists():
            continue

        for yaml_file in category_path.glob("*.yaml"):
            if yaml_file.name in ["companies.yaml", "quadrants.yaml"]:
                continue

            try:
                with open(yaml_file, "r") as f:
                    content = f.read()
                    data = parse_yaml_simple(content)
                    if data and "name" in data:
                        relative_path = f"{category}/{yaml_file.name}"
                        entries[relative_path] = data
            except Exception as e:
                pass  # Silently skip files that can't be parsed

    return entries


def list_radar_entries() -> Dict[str, List[str]]:
    """List all available radar entries by category."""
    entries_by_category = {cat: [] for cat in CATEGORIES}

    for category in CATEGORIES:
        category_path = RADAR_BASE_PATH / category
        if not category_path.exists():
            continue

        for yaml_file in sorted(category_path.glob("*.yaml")):
            if yaml_file.name not in ["companies.yaml", "quadrants.yaml"]:
                entries_by_category[category].append(yaml_file.stem)

    return entries_by_category


def get_all_tags_simple(entries: Dict[str, Dict]) -> Dict[str, int]:
    """Extract tags from entries."""
    from collections import defaultdict
    tag_counts = defaultdict(int)

    for entry in entries.values():
        # Look for tags in the raw entry data
        for key, value in entry.items():
            if key == 'tags' and isinstance(value, str):
                # Try to parse tags from string representation
                tags = re.findall(r'\b[\w-]+\b', value)
                for tag in tags:
                    tag_counts[tag] += 1

    return dict(sorted(tag_counts.items(), key=lambda x: x[1], reverse=True))


def find_related_by_keyword(
    tech_name: str, description: str, entries: Dict[str, Dict], limit: int = 5
) -> List[str]:
    """
    Find related entries based on keyword matching.
    Returns list of relative paths.
    """
    keywords = set(tech_name.lower().split())
    keywords.update(word for word in description.lower().split() if len(word) > 4)

    scored_entries = []

    for rel_path, entry in entries.items():
        entry_name = entry.get("name", "").lower()
        entry_desc = entry.get("description", "").lower()

        # Calculate similarity
        score = 0

        # Direct name match
        if tech_name.lower() in entry_name or entry_name in tech_name.lower():
            score += 2

        # Keyword matches
        for keyword in keywords:
            if keyword in entry_name:
                score += 1
            if keyword in entry_desc:
                score += 0.5

        if score > 0:
            scored_entries.append((rel_path, score))

    # Sort and return
    scored_entries.sort(key=lambda x: x[1], reverse=True)
    return [rel_path for rel_path, _ in scored_entries[:limit]]


def main():
    """Main entry point."""
    print("Radar Entry Analysis Tool")
    print("=" * 50)

    print("\nScanning radar entries...")
    entries_by_cat = list_radar_entries()

    total_entries = sum(len(entries) for entries in entries_by_cat.values())
    print(f"Found {total_entries} entries across {len(CATEGORIES)} categories:\n")

    for category, entries in entries_by_cat.items():
        if entries:
            print(f"  {category}: {len(entries)} entries")

    print("\n" + "=" * 50)
    print("Examples of available technologies:")

    for category, entries in entries_by_cat.items():
        if entries:
            examples = entries[:3]
            print(f"\n  {category}:")
            for entry in examples:
                print(f"    - {entry}")
            if len(entries) > 3:
                print(f"    ... and {len(entries) - 3} more")


if __name__ == "__main__":
    main()
