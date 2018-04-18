# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", ip: "10.124.15.6"

  # Forward the Rails server default port to the host§
  config.vm.network :forwarded_port, guest: 5000, host: 5000

  config.vm.provider "virtualbox" do |vb|
    vb.name = "boss"

    vb.customize ["modifyvm", :id, "--memory", ENV["BOSS_VAGRANT_MEMORY"] || "2048"]
  end

  config.vm.synced_folder "./", "/vagrant", type: "nfs", :mount_options => ["lookupcache=none"]

  # run provision script
  config.vm.provision "shell", path: "vagrant/provision.sh", privileged: false
end
