#!/usr/bin/env python

import glob
from pykwalify.core import Core
import pykwalify

exitCode = 0

pykwalify.init_logging(0)

for file in glob.glob("radar/**/*.yaml"):
    c = Core(source_file=file, schema_files=["radar_entry.schema.yaml"], extensions=[".scripts/companies.py"])
    try:
        c.validate(raise_exception=True)
    except Exception as e:
        msg = e.msg if hasattr(e, 'msg') else e.message
        print("ERROR - " + file + "\n" + msg)
        exitCode += 1

for file in glob.glob("radar/**/*.yml"):
  print("ERROR - " + file + "\nIncorrect extension, rename to '.yaml'")
  exitCode +=1

if exitCode > 0:
    print(str(exitCode) + " validation error(s).")

exit(exitCode)
