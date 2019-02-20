#!/usr/bin/env python

import glob, os
from pykwalify.core import Core

exitCode = 0
for file in glob.glob("radar/**/*.yaml"):
    print(file)
    c = Core(source_file=file, schema_files=["radar-entry.yaml"])
    try:
        c.validate(raise_exception=True)
    except:
        exitCode += 1
exit(exitCode)
