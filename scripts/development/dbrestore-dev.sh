if [ "$1" = "" ]; then echo "Missing argument: Data dump directory missing."; exit 0; fi;

echo 'Are you sure you want to restore to sts-integratedsystem-dev? y/n (database will be drop first)';
read DECISION;

if [ "$DECISION" != "y" ]; then exit 0; fi;

mongo sts-integratedsystem-dev --eval "db.dropDatabase();"
mongorestore --db sts-integratedsystem-dev $1