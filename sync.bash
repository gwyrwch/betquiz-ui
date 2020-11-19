set -e

rsync -r ui yura@178.154.235.122:/home/yura/betquiz-ui
rsync -r *.js yura@178.154.235.122:/home/yura/betquiz-ui
rsync -r package.json yura@178.154.235.122:/home/yura/betquiz-ui
rsync -r *.bash yura@178.154.235.122:/home/yura/betquiz-ui
