#!/usr/bin/env python3
"""
Radar Entry Helper Script
This script helps the radar-writer copilot agent by analyzing existing radar entries
and providing suggestions for tags, related entries, and structure validation.

Requirements: pyyaml (install via: pip install pyyaml)
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Set, Tuple
from collections import defaultdict

try:
    import yaml
except ImportError:
    print("Error: PyYAML is not installed. Please install it with:")
    print("  pip install pyyaml")
    print("Or install all requirements with:")
    print("  pip install -r .scripts/python_requirements.txt")
    exit(1)

# Base path for radar entries
RADAR_BASE_PATH = Path(__file__).parent.parent / "radar"
CATEGORIES = ["ai", "data_management", "dev", "infrastructure_ci_cd", "qa"]


def load_all_radar_entries() -> Dict[str, Dict]:
    """Load all radar entries from the radar directory."""
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
                    data = yaml.safe_load(f)
                    if data and "name" in data:
                        relative_path = f"{category}/{yaml_file.name}"
                        entries[relative_path] = data
            except Exception as e:
                print(f"Warning: Could not load {yaml_file}: {e}")

    return entries


def get_all_tags(entries: Dict[str, Dict]) -> Dict[str, int]:
    """Extract and count all tags used in radar entries."""
    tag_counts = defaultdict(int)

    for entry in entries.values():
        if "tags" in entry and isinstance(entry["tags"], list):
            for tag in entry["tags"]:
                tag_counts[tag] += 1

    return dict(sorted(tag_counts.items(), key=lambda x: x[1], reverse=True))


def find_related_entries(
    tech_name: str, description: str, entries: Dict[str, Dict], limit: int = 5
) -> List[Tuple[str, float]]:
    """
    Find related entries based on technology name and description.
    Returns list of (relative_path, similarity_score) tuples.
    """
    keywords = set(tech_name.lower().split()) | set(
        word for word in description.lower().split() if len(word) > 4
    )

    scored_entries = []

    for rel_path, entry in entries.items():
        entry_name = entry.get("name", "").lower()
        entry_desc = entry.get("description", "").lower()

        # Calculate similarity score
        score = 0

        # Direct name matches
        if tech_name.lower() in entry_name or entry_name in tech_name.lower():
            score += 2

        # Keyword matches in name
        for keyword in keywords:
            if keyword in entry_name:
                score += 1

        # Keyword matches in description (lower weight)
        for keyword in keywords:
            if keyword in entry_desc:
                score += 0.5

        if score > 0:
            scored_entries.append((rel_path, score))

    # Sort by score and return top entries
    scored_entries.sort(key=lambda x: x[1], reverse=True)
    return scored_entries[:limit]


def suggest_tags(
    tech_name: str,
    description: str,
    category: str,
    entries: Dict[str, Dict],
    all_tags: Dict[str, int],
    limit: int = 5,
) -> List[str]:
    """
    Suggest tags based on the technology and category.
    """
    suggested = set()

    # Add category as a tag (lowercase, no underscores)
    category_tag = category.replace("_", "-")
    suggested.add(category_tag)

    # Extract potential tags from description
    # Look for common technical keywords
    keywords = re.findall(r"\b[a-z]+(?:-[a-z]+)?\b", description.lower())

    # Cross-reference with existing tags
    for keyword in keywords:
        if keyword in all_tags and all_tags[keyword] > 1:
            suggested.add(keyword)

    # Look at related entries' tags
    related = find_related_entries(tech_name, description, entries, limit=3)
    for rel_path, _ in related:
        if rel_path in entries and "tags" in entries[rel_path]:
            for tag in entries[rel_path]["tags"]:
                if tag != category_tag:  # Don't duplicate category
                    suggested.add(tag)

    # Return sorted list of unique tags
    return sorted(list(suggested))[:limit]


def validate_yaml_structure(data: Dict) -> Tuple[bool, List[str]]:
    """
    Validate that a radar entry follows the schema.
    Returns (is_valid, list_of_errors).
    """
    errors = []

    # Check required fields
    required_fields = ["name", "description", "rationale", "blip"]
    for field in required_fields:
        if field not in data:
            errors.append(f"Missing required field: {field}")

    # Check blip structure
    if "blip" in data:
        if not isinstance(data["blip"], list) or len(data["blip"]) == 0:
            errors.append("blip must be a non-empty array")
        else:
            for i, blip_entry in enumerate(data["blip"]):
                if "date" not in blip_entry:
                    errors.append(f"blip[{i}]: missing required field 'date'")
                if "ring" not in blip_entry:
                    errors.append(f"blip[{i}]: missing required field 'ring'")
                elif blip_entry["ring"] not in ["ADOPT", "TRIAL", "ASSESS", "HOLD", "ARCHIVE"]:
                    errors.append(f"blip[{i}]: invalid ring value '{blip_entry['ring']}'")

    # Validate tags
    if "tags" in data:
        if not isinstance(data["tags"], list):
            errors.append("tags must be an array")

    # Validate related
    if "related" in data:
        if not isinstance(data["related"], list):
            errors.append("related must be an array")
        else:
            for rel in data["related"]:
                if not rel.endswith(".yaml"):
                    errors.append(f"related entry '{rel}' must end with .yaml")

    return len(errors) == 0, errors


def main():
    """Main function for testing and utility purposes."""
    print("Loading radar entries...")
    entries = load_all_radar_entries()
    print(f"Loaded {len(entries)} entries from {len(CATEGORIES)} categories")

    print("\nTop 20 most used tags:")
    all_tags = get_all_tags(entries)
    for tag, count in list(all_tags.items())[:20]:
        print(f"  {tag}: {count}")

    # Example: find related entries for a fictional technology
    print("\n\nExample: Finding related entries for 'TypeScript'")
    related = find_related_entries(
        "TypeScript",
        "A programming language that builds on JavaScript",
        entries,
    )
    print("Related entries:")
    for rel_path, score in related:
        print(f"  {rel_path}: {score:.1f}")

    # Example: suggest tags
    print("\n\nExample: Suggesting tags for TypeScript in dev category")
    tags = suggest_tags(
        "TypeScript",
        "A programming language that builds on JavaScript by adding type safety",
        "dev",
        entries,
        all_tags,
    )
    print(f"Suggested tags: {', '.join(tags)}")


if __name__ == "__main__":
    main()
