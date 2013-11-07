# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table action (
  id                        bigint not null,
  action_type               varchar(255),
  user_id                   bigint,
  item_id                   varchar(255),
  date                      bigint,
  constraint pk_action primary key (id))
;

create table buy_order (
  id                        bigint not null,
  item_id                   varchar(255),
  price                     bigint,
  buyer_id                  bigint,
  size                      varchar(255),
  points_used               integer,
  points_earned             integer,
  state                     integer,
  constraint ck_buy_order_state check (state in (0,1,2,3)),
  constraint pk_buy_order primary key (id))
;

create table buyer (
  id                        bigint not null,
  user_user_id              bigint,
  points                    integer,
  mail                      varchar(255),
  constraint pk_buyer primary key (id))
;

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
  views                     integer,
  purchases                 integer,
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
  user_user_id              bigint,
  brand_name                varchar(255),
  points_enabled            boolean,
  point_money_relation      double,
  mp_client_secret          varchar(255),
  mp_client_id              varchar(255),
  logo_url                  varchar(255),
  webpage_url               varchar(255),
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

create table wishlist_item (
  id                        varchar(255) not null,
  item_id                   varchar(255),
  owner_user_id             bigint,
  create_time               timestamp not null,
  update_time               timestamp not null,
  constraint pk_wishlist_item primary key (id))
;


create table user_rol (
  user_user_id                   bigint not null,
  rol_id                         bigint not null,
  constraint pk_user_rol primary key (user_user_id, rol_id))
;
create sequence action_seq;

create sequence buy_order_seq;

create sequence buyer_seq;

create sequence collection_seq;

create sequence item_seq;

create sequence rol_seq;

create sequence seller_seq;

create sequence stock_seq;

create sequence user_seq;

create sequence wishlist_item_seq;

alter table buy_order add constraint fk_buy_order_item_1 foreign key (item_id) references item (id) on delete restrict on update restrict;
create index ix_buy_order_item_1 on buy_order (item_id);
alter table buy_order add constraint fk_buy_order_buyer_2 foreign key (buyer_id) references buyer (id) on delete restrict on update restrict;
create index ix_buy_order_buyer_2 on buy_order (buyer_id);
alter table buyer add constraint fk_buyer_user_3 foreign key (user_user_id) references user (user_id) on delete restrict on update restrict;
create index ix_buyer_user_3 on buyer (user_user_id);
alter table collection add constraint fk_collection_seller_4 foreign key (seller_id) references seller (id) on delete restrict on update restrict;
create index ix_collection_seller_4 on collection (seller_id);
alter table item add constraint fk_item_seller_5 foreign key (seller_id) references seller (id) on delete restrict on update restrict;
create index ix_item_seller_5 on item (seller_id);
alter table item add constraint fk_item_collection_6 foreign key (collection_id) references collection (id) on delete restrict on update restrict;
create index ix_item_collection_6 on item (collection_id);
alter table seller add constraint fk_seller_user_7 foreign key (user_user_id) references user (user_id) on delete restrict on update restrict;
create index ix_seller_user_7 on seller (user_user_id);
alter table stock add constraint fk_stock_item_8 foreign key (item_id) references item (id) on delete restrict on update restrict;
create index ix_stock_item_8 on stock (item_id);
alter table wishlist_item add constraint fk_wishlist_item_item_9 foreign key (item_id) references item (id) on delete restrict on update restrict;
create index ix_wishlist_item_item_9 on wishlist_item (item_id);
alter table wishlist_item add constraint fk_wishlist_item_owner_10 foreign key (owner_user_id) references user (user_id) on delete restrict on update restrict;
create index ix_wishlist_item_owner_10 on wishlist_item (owner_user_id);



alter table user_rol add constraint fk_user_rol_user_01 foreign key (user_user_id) references user (user_id) on delete restrict on update restrict;

alter table user_rol add constraint fk_user_rol_rol_02 foreign key (rol_id) references rol (id) on delete restrict on update restrict;

# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists action;

drop table if exists buy_order;

drop table if exists buyer;

drop table if exists collection;

drop table if exists item;

drop table if exists rol;

drop table if exists seller;

drop table if exists stock;

drop table if exists user;

drop table if exists user_rol;

drop table if exists wishlist_item;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists action_seq;

drop sequence if exists buy_order_seq;

drop sequence if exists buyer_seq;

drop sequence if exists collection_seq;

drop sequence if exists item_seq;

drop sequence if exists rol_seq;

drop sequence if exists seller_seq;

drop sequence if exists stock_seq;

drop sequence if exists user_seq;

drop sequence if exists wishlist_item_seq;

