# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table collection (
  id                        bigint not null,
  title                     varchar(255),
  description               varchar(255),
  seller_id                 bigint,
  constraint pk_collection primary key (id))
;

create table item (
  id                        varchar(255) not null,
  title                     varchar(255),
  description               varchar(255),
  img_url                   varchar(255),
  price                     bigint,
  sex                       varchar(255),
  seller_id                 bigint,
  collection_id             bigint,
  views                     bigint,
  create_time               timestamp not null,
  update_time               timestamp not null,
  constraint pk_item primary key (id))
;

create table rol (
  id                        bigint not null,
  name                      varchar(255),
  constraint pk_rol primary key (id))
;

create table seller (
  id                        bigint not null,
  fb_uid                    bigint,
  name                      varchar(255),
  merchant_id               bigint,
  logo_url                  varchar(255),
  webpage_url               varchar(255),
  insert_date               timestamp,
  constraint pk_seller primary key (id))
;

create table stock (
  id                        varchar(255) not null,
  size                      varchar(255),
  stock                     integer,
  item_id                   varchar(255),
  create_time               timestamp not null,
  update_time               timestamp not null,
  constraint pk_stock primary key (id))
;

create table user (
  user_id                   bigint not null,
  name                      varchar(255),
  constraint pk_user primary key (user_id))
;


create table user_rol (
  user_user_id                   bigint not null,
  rol_id                         bigint not null,
  constraint pk_user_rol primary key (user_user_id, rol_id))
;
create sequence collection_seq;

create sequence item_seq;

create sequence rol_seq;

create sequence seller_seq;

create sequence stock_seq;

create sequence user_seq;

alter table collection add constraint fk_collection_seller_1 foreign key (seller_id) references seller (id) on delete restrict on update restrict;
create index ix_collection_seller_1 on collection (seller_id);
alter table item add constraint fk_item_seller_2 foreign key (seller_id) references seller (id) on delete restrict on update restrict;
create index ix_item_seller_2 on item (seller_id);
alter table item add constraint fk_item_collection_3 foreign key (collection_id) references collection (id) on delete restrict on update restrict;
create index ix_item_collection_3 on item (collection_id);
alter table stock add constraint fk_stock_item_4 foreign key (item_id) references item (id) on delete restrict on update restrict;
create index ix_stock_item_4 on stock (item_id);



alter table user_rol add constraint fk_user_rol_user_01 foreign key (user_user_id) references user (user_id) on delete restrict on update restrict;

alter table user_rol add constraint fk_user_rol_rol_02 foreign key (rol_id) references rol (id) on delete restrict on update restrict;

# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists collection;

drop table if exists item;

drop table if exists rol;

drop table if exists seller;

drop table if exists stock;

drop table if exists user;

drop table if exists user_rol;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists collection_seq;

drop sequence if exists item_seq;

drop sequence if exists rol_seq;

drop sequence if exists seller_seq;

drop sequence if exists stock_seq;

drop sequence if exists user_seq;

