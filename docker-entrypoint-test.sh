#!/bin/bash
set -e

cd /home/node/matrix-dimension/

NODE_ENV=test node build/app/index.js

