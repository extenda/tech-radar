import yaml

with open("radar/companies.yaml", "r") as stream:
    companies = yaml.safe_load(stream)

def company_enum(value, rule_obj, path):
    if not value in companies:
        raise AssertionError("'" + value + "' is not defined in companies.yaml")

    return True
