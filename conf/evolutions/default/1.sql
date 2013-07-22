# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table collection (
  id                        bigint not null,
  title                     varchar(255),
  description               varchar(255),
  owner_id                  bigint,
  constraint pk_collection primary key (id))
;

create table item (
  id                        varchar(255) not null,
  title                     varchar(255),
  description               varchar(255),
  img_url                   varchar(255),
  owner_id                  bigint,
  collection_id             bigint,
  constraint pk_item primary key (id))
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

create sequence collection_seq;

create sequence item_seq;

create sequence seller_seq;

alter table collection add constraint fk_collection_owner_1 foreign key (owner_id) references seller (id) on delete restrict on update restrict;
create index ix_collection_owner_1 on collection (owner_id);
alter table item add constraint fk_item_owner_2 foreign key (owner_id) references seller (id) on delete restrict on update restrict;
create index ix_item_owner_2 on item (owner_id);
alter table item add constraint fk_item_collection_3 foreign key (collection_id) references collection (id) on delete restrict on update restrict;
create index ix_item_collection_3 on item (collection_id);



# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists collection;

drop table if exists item;

drop table if exists seller;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists collection_seq;

drop sequence if exists item_seq;

drop sequence if exists seller_seq;

