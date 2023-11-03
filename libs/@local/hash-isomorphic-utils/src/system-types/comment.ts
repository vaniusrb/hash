/**
 * This file was automatically generated – do not edit it.
 */

import {
  Author,
  AuthorOutgoingLinkAndTarget,
  AuthorOutgoingLinksByLinkEntityTypeId,
  AuthorProperties,
  Block,
  BlockBlockDataLink,
  BlockCollection,
  BlockCollectionContainsLink,
  BlockCollectionOutgoingLinkAndTarget,
  BlockCollectionOutgoingLinksByLinkEntityTypeId,
  BlockCollectionProperties,
  BlockData,
  BlockDataOutgoingLinkAndTarget,
  BlockDataOutgoingLinksByLinkEntityTypeId,
  BlockDataProperties,
  BlockOutgoingLinkAndTarget,
  BlockOutgoingLinksByLinkEntityTypeId,
  BlockProperties,
  BooleanDataType,
  Comment,
  CommentAuthorLink,
  CommentHasTextLink,
  CommentOutgoingLinkAndTarget,
  CommentOutgoingLinksByLinkEntityTypeId,
  CommentParentLink,
  CommentProperties,
  ComponentIdPropertyValue,
  Contains,
  ContainsOutgoingLinkAndTarget,
  ContainsOutgoingLinksByLinkEntityTypeId,
  ContainsProperties,
  DeletedAtPropertyValue,
  DescriptionPropertyValue,
  DisplayNamePropertyValue,
  EmailPropertyValue,
  File,
  FileHashPropertyValue,
  FileNamePropertyValue,
  FileOutgoingLinkAndTarget,
  FileOutgoingLinksByLinkEntityTypeId,
  FileProperties,
  FileSizePropertyValue,
  FileStorageBucketPropertyValue,
  FileStorageEndpointPropertyValue,
  FileStorageForcePathStylePropertyValue,
  FileStorageKeyPropertyValue,
  FileStorageProviderPropertyValue,
  FileStorageRegionPropertyValue,
  FileURLPropertyValue,
  HasAvatar,
  HasAvatarOutgoingLinkAndTarget,
  HasAvatarOutgoingLinksByLinkEntityTypeId,
  HasAvatarProperties,
  HasBio,
  HasBioOutgoingLinkAndTarget,
  HasBioOutgoingLinksByLinkEntityTypeId,
  HasBioProperties,
  HasCoverImage,
  HasCoverImageOutgoingLinkAndTarget,
  HasCoverImageOutgoingLinksByLinkEntityTypeId,
  HasCoverImageProperties,
  HasServiceAccount,
  HasServiceAccountOutgoingLinkAndTarget,
  HasServiceAccountOutgoingLinksByLinkEntityTypeId,
  HasServiceAccountProperties,
  HasText,
  HasTextOutgoingLinkAndTarget,
  HasTextOutgoingLinksByLinkEntityTypeId,
  HasTextProperties,
  Image,
  ImageOutgoingLinkAndTarget,
  ImageOutgoingLinksByLinkEntityTypeId,
  ImageProperties,
  KratosIdentityIdPropertyValue,
  Link,
  LinkOutgoingLinkAndTarget,
  LinkOutgoingLinksByLinkEntityTypeId,
  LinkProperties,
  LocationPropertyValue,
  MIMETypePropertyValue,
  NumberDataType,
  NumericIndexPropertyValue,
  ObjectDataType,
  Org,
  OrganizationNamePropertyValue,
  OrganizationProvidedInformationPropertyValue,
  OrganizationSizePropertyValue,
  OrgHasAvatarLink,
  OrgHasBioLink,
  OrgHasCoverImageLink,
  OrgMembership,
  OrgMembershipOutgoingLinkAndTarget,
  OrgMembershipOutgoingLinksByLinkEntityTypeId,
  OrgMembershipProperties,
  OrgOutgoingLinkAndTarget,
  OrgOutgoingLinksByLinkEntityTypeId,
  OrgProperties,
  OriginalFileNamePropertyValue,
  OriginalSourcePropertyValue,
  OriginalURLPropertyValue,
  Parent,
  ParentOutgoingLinkAndTarget,
  ParentOutgoingLinksByLinkEntityTypeId,
  ParentProperties,
  PinnedEntityTypeBaseURLPropertyValue,
  PreferredNamePropertyValue,
  PreferredPronounsPropertyValue,
  ProfileBio,
  ProfileBioOutgoingLinkAndTarget,
  ProfileBioOutgoingLinksByLinkEntityTypeId,
  ProfileBioProperties,
  ProfileURLPropertyValue,
  ResolvedAtPropertyValue,
  ServiceAccount,
  ServiceAccountOutgoingLinkAndTarget,
  ServiceAccountOutgoingLinksByLinkEntityTypeId,
  ServiceAccountProperties,
  ShortnamePropertyValue,
  Text,
  TextDataType,
  TextOutgoingLinkAndTarget,
  TextOutgoingLinksByLinkEntityTypeId,
  TextProperties,
  TextualContentPropertyValue,
  User,
  UserHasAvatarLink,
  UserHasBioLink,
  UserHasServiceAccountLink,
  UserOrgMembershipLink,
  UserOutgoingLinkAndTarget,
  UserOutgoingLinksByLinkEntityTypeId,
  UserProperties,
  WebsitePropertyValue,
} from "./shared";

export type {
  Author,
  AuthorOutgoingLinkAndTarget,
  AuthorOutgoingLinksByLinkEntityTypeId,
  AuthorProperties,
  Block,
  BlockBlockDataLink,
  BlockCollection,
  BlockCollectionContainsLink,
  BlockCollectionOutgoingLinkAndTarget,
  BlockCollectionOutgoingLinksByLinkEntityTypeId,
  BlockCollectionProperties,
  BlockData,
  BlockDataOutgoingLinkAndTarget,
  BlockDataOutgoingLinksByLinkEntityTypeId,
  BlockDataProperties,
  BlockOutgoingLinkAndTarget,
  BlockOutgoingLinksByLinkEntityTypeId,
  BlockProperties,
  BooleanDataType,
  Comment,
  CommentAuthorLink,
  CommentHasTextLink,
  CommentOutgoingLinkAndTarget,
  CommentOutgoingLinksByLinkEntityTypeId,
  CommentParentLink,
  CommentProperties,
  ComponentIdPropertyValue,
  Contains,
  ContainsOutgoingLinkAndTarget,
  ContainsOutgoingLinksByLinkEntityTypeId,
  ContainsProperties,
  DeletedAtPropertyValue,
  DescriptionPropertyValue,
  DisplayNamePropertyValue,
  EmailPropertyValue,
  File,
  FileHashPropertyValue,
  FileNamePropertyValue,
  FileOutgoingLinkAndTarget,
  FileOutgoingLinksByLinkEntityTypeId,
  FileProperties,
  FileSizePropertyValue,
  FileStorageBucketPropertyValue,
  FileStorageEndpointPropertyValue,
  FileStorageForcePathStylePropertyValue,
  FileStorageKeyPropertyValue,
  FileStorageProviderPropertyValue,
  FileStorageRegionPropertyValue,
  FileURLPropertyValue,
  HasAvatar,
  HasAvatarOutgoingLinkAndTarget,
  HasAvatarOutgoingLinksByLinkEntityTypeId,
  HasAvatarProperties,
  HasBio,
  HasBioOutgoingLinkAndTarget,
  HasBioOutgoingLinksByLinkEntityTypeId,
  HasBioProperties,
  HasCoverImage,
  HasCoverImageOutgoingLinkAndTarget,
  HasCoverImageOutgoingLinksByLinkEntityTypeId,
  HasCoverImageProperties,
  HasServiceAccount,
  HasServiceAccountOutgoingLinkAndTarget,
  HasServiceAccountOutgoingLinksByLinkEntityTypeId,
  HasServiceAccountProperties,
  HasText,
  HasTextOutgoingLinkAndTarget,
  HasTextOutgoingLinksByLinkEntityTypeId,
  HasTextProperties,
  Image,
  ImageOutgoingLinkAndTarget,
  ImageOutgoingLinksByLinkEntityTypeId,
  ImageProperties,
  KratosIdentityIdPropertyValue,
  Link,
  LinkOutgoingLinkAndTarget,
  LinkOutgoingLinksByLinkEntityTypeId,
  LinkProperties,
  LocationPropertyValue,
  MIMETypePropertyValue,
  NumberDataType,
  NumericIndexPropertyValue,
  ObjectDataType,
  Org,
  OrganizationNamePropertyValue,
  OrganizationProvidedInformationPropertyValue,
  OrganizationSizePropertyValue,
  OrgHasAvatarLink,
  OrgHasBioLink,
  OrgHasCoverImageLink,
  OrgMembership,
  OrgMembershipOutgoingLinkAndTarget,
  OrgMembershipOutgoingLinksByLinkEntityTypeId,
  OrgMembershipProperties,
  OrgOutgoingLinkAndTarget,
  OrgOutgoingLinksByLinkEntityTypeId,
  OrgProperties,
  OriginalFileNamePropertyValue,
  OriginalSourcePropertyValue,
  OriginalURLPropertyValue,
  Parent,
  ParentOutgoingLinkAndTarget,
  ParentOutgoingLinksByLinkEntityTypeId,
  ParentProperties,
  PinnedEntityTypeBaseURLPropertyValue,
  PreferredNamePropertyValue,
  PreferredPronounsPropertyValue,
  ProfileBio,
  ProfileBioOutgoingLinkAndTarget,
  ProfileBioOutgoingLinksByLinkEntityTypeId,
  ProfileBioProperties,
  ProfileURLPropertyValue,
  ResolvedAtPropertyValue,
  ServiceAccount,
  ServiceAccountOutgoingLinkAndTarget,
  ServiceAccountOutgoingLinksByLinkEntityTypeId,
  ServiceAccountProperties,
  ShortnamePropertyValue,
  Text,
  TextDataType,
  TextOutgoingLinkAndTarget,
  TextOutgoingLinksByLinkEntityTypeId,
  TextProperties,
  TextualContentPropertyValue,
  User,
  UserHasAvatarLink,
  UserHasBioLink,
  UserHasServiceAccountLink,
  UserOrgMembershipLink,
  UserOutgoingLinkAndTarget,
  UserOutgoingLinksByLinkEntityTypeId,
  UserProperties,
  WebsitePropertyValue,
};
