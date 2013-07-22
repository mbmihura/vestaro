# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table collection (
  id                        bigint not null,
  constraint pk_collection primary key (id))
;

create table item (
  id                        varchar(255) not null,
  constraint pk_item primary key (id))
;

create table seller (
  id                        bigint not null,
  constraint pk_seller primary key (id))
;

create sequence collection_seq;

create sequence item_seq;

create sequence seller_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists collection;

drop table if exists item;

drop table if exists seller;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists collection_seq;

drop sequence if exists item_seq;

drop sequence if exists seller_seq;

