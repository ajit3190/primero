#! /bin/bash
# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

: "${PRIMERO_DEPLOY_NODB:=false}"
: "${SOLR_ENABLED:=false}"

DB_PROFILE=""
SOLR_PROFILE=""

set -euox

if [[ "${PRIMERO_DEPLOY_NODB}" == 'false' ]] ; then
  DB_PROFILE="--profile db"
fi

if [[ "${SOLR_ENABLED}" == 'true' ]] ; then
  SOLR_PROFILE="--profile solr"
fi

exec "./compose.sh" ${DB_PROFILE} ${SOLR_PROFILE} -f "docker-compose.prod.yml" -f "docker-compose.db.yml" "${@}"