#!/bin/bash
#
# A script to provision a Vagrant box

set -e

main() {
  export DEBIAN_FRONTEND=noninteractive

  cd "/vagrant"

  fix_dns
  upgrade_packages
  install_git
  install_ruby
  install_jq
  install_nodejs
  install_mysql
  install_redis
  add_github_host_key
  bundle_gems
  install_npm_modules
  setup_database
  append_bashrc 'export PATH=$PATH:/vagrant/bin'
  append_bashrc 'cd /vagrant'
}

fix_dns() {
  # VirtualBox adds a 5s delay to some DNS queries when this isn't set
  local line="options single-request-reopen"
  grep -qxF "${line}" /etc/resolv.conf || echo "${line}" | sudo tee -a /etc/resolv.conf
}

upgrade_packages() {
  grep -qF 'gb.archive.ubuntu.com' /etc/apt/sources.list || sudo sed -i 's/archive.ubuntu/gb.archive.ubuntu/g' /etc/apt/sources.list
  sudo apt-get update
  sudo apt-get upgrade -y
}

install_git() {
  sudo apt-get install -y git
}

install_ruby() {
  sudo apt-get install -y build-essential libvirt-dev libssl-dev libssl0.9.8 libxslt1-dev libxml2-dev libreadline5

  local version="$(cat ".ruby-version")"

  if ! ruby -v | grep -qF "ruby ${version}"; then
    curl -fsSL "https://s3-external-1.amazonaws.com/heroku-buildpack-ruby/cedar-14/ruby-${version}.tgz" | sudo tar xz -C /usr/local
  fi

  if ! which bundle &>/dev/null; then
    sudo gem install bundler
  fi
}

install_jq() {
  sudo curl -fsSLo "/usr/local/bin/jq" "http://stedolan.github.io/jq/download/linux64/jq"
  sudo chmod +x "/usr/local/bin/jq"
}

install_nodejs() {
  # grab the version from package.json
  local version="$(jq --raw-output .engines.node package.json)"

  # resolve the version using Heroku's semver app
  version="$(curl --silent --get --retry 5 --retry-max-time 15 --data-urlencode "range=${version}" https://semver.herokuapp.com/node/resolve)"

  # check if already installed
  if node --version | grep -qxF "v${version}"; then
    return
  fi

  # download and install
  local download_url="http://s3pository.heroku.com/node/v${version}/node-v${version}-linux-x64.tar.gz"
  local tmp="$(mktemp --directory)"
  trap "rm -rf ${tmp}" EXIT
  curl "${download_url}" --silent --fail -o "${tmp}/node.tar.gz" || (echo "Unable to download node from ${download_url}, does it exist?" && false)
  sudo tar xzf "${tmp}/node.tar.gz" -C "/usr/local"
  sudo ln -nfs /usr/local/node-v*/bin/* /usr/local/bin
}

install_mysql() {
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server-5.5 mysql-client-5.5 libmysqlclient-dev
}

install_redis() {
  sudo apt-get install -y redis-server
}

add_github_host_key() {
  if [[ ! -f "/etc/ssh/ssh_known_hosts" ]] || [[ -z "$(ssh-keygen -F "github.com" -f "/etc/ssh/ssh_known_hosts" 2>&1)" ]]; then
    ssh-keyscan -H "github.com" 2>/dev/null | sudo tee -a "/etc/ssh/ssh_known_hosts" &>/dev/null
  fi
}

bundle_gems() {
  sudo apt-get install -y libmagickwand-dev
  bundle install
}

install_npm_modules() {
  npm install --quiet
}

setup_database() {
  bundle exec rake db:setup
}

append_bashrc() {
  local cmd=$1
  grep -qF "${cmd}" ~/.bashrc || echo "${cmd}" >> ~/.bashrc
}

main $@
