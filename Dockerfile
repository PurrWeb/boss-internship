FROM ruby:2.3.7

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends apt-utils
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y build-essential \
                       libpq-dev \
                       libmagickwand-dev \
                       nodejs \
                       vim \
                       libvirt-dev \
                       libssl-dev \
                       libxslt1-dev \
                       libxml2-dev \
                       libreadline5 \
                       mysql-client \
                       --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*


ENV INSTALL_PATH /boss
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

ENV GEM_HOME /gems
ENV GEM_PATH /gems
ENV BUNDLE_PATH /gems

COPY . .

RUN gem install bundler
