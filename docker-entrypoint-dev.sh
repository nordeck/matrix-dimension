#!/bin/bash
set -e

cd /home/node/matrix-dimension/

NODE_ENV=dev node build/app/index.js

