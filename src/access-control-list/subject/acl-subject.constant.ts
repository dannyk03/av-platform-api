export enum AclBaseSubjectEnum {
  System = 'System',
  Organization = 'Organization',
  User = 'User',
  Policy = 'Policy',
  Role = 'Role',
  Subject = 'Subject',
  Ability = 'Ability',
  CreditCard = 'CreditCard',
  Invoice = 'Invoice',
  Payment = 'Payment',
  Order = 'Order',
  Gift = 'Gift',
}

export enum AclNamespaceSubjectEnum {
  OrganizationNamespace = 'OrganizationNamespace',
  SecurityNamespace = 'SecurityNamespace',
  FinanceNamespace = 'FinanceNamespace',
  GiftingNamespace = 'GiftingNamespace',
}

export const AclNamespaceSubjects = Object.freeze({
  [AclNamespaceSubjectEnum.OrganizationNamespace]: [
    ...Object.values(AclBaseSubjectEnum),
    ...Object.values(AclNamespaceSubjectEnum),
  ],
  [AclNamespaceSubjectEnum.SecurityNamespace]: [
    AclBaseSubjectEnum.Role,
    AclBaseSubjectEnum.Policy,
    AclBaseSubjectEnum.Subject,
    AclBaseSubjectEnum.Ability,
  ],
  [AclNamespaceSubjectEnum.FinanceNamespace]: [
    AclBaseSubjectEnum.Payment,
    AclBaseSubjectEnum.CreditCard,
    AclBaseSubjectEnum.Invoice,
  ],
  [AclNamespaceSubjectEnum.GiftingNamespace]: [AclBaseSubjectEnum.Gift],
});

export const AclCompositeSubjects = Object.freeze({
  [AclNamespaceSubjectEnum.OrganizationNamespace]: [
    ...new Set([
      AclNamespaceSubjectEnum.OrganizationNamespace,
      ...AclNamespaceSubjects[AclNamespaceSubjectEnum.OrganizationNamespace],
      ...AclNamespaceSubjects[AclNamespaceSubjectEnum.SecurityNamespace],
      ...AclNamespaceSubjects[AclNamespaceSubjectEnum.FinanceNamespace],
      ...AclNamespaceSubjects[AclNamespaceSubjectEnum.GiftingNamespace],
    ]),
  ],
  [AclNamespaceSubjectEnum.SecurityNamespace]: [
    ...new Set([
      AclNamespaceSubjectEnum.SecurityNamespace,
      ...AclNamespaceSubjects[AclNamespaceSubjectEnum.SecurityNamespace],
    ]),
  ],
  [AclNamespaceSubjectEnum.FinanceNamespace]: [
    ...new Set([
      AclNamespaceSubjectEnum.FinanceNamespace,
      ...AclNamespaceSubjects[AclNamespaceSubjectEnum.FinanceNamespace],
    ]),
  ],
  [AclNamespaceSubjectEnum.GiftingNamespace]: [
    ...new Set([
      AclNamespaceSubjectEnum.GiftingNamespace,
      ...AclNamespaceSubjects[AclNamespaceSubjectEnum.GiftingNamespace],
    ]),
  ],
});

export const AclSubjectTypeDict = Object.freeze({
  ...AclBaseSubjectEnum,
  ...AclNamespaceSubjectEnum,
});

export type AclSubjectType = AclBaseSubjectEnum | AclNamespaceSubjectEnum;

export const AclSubjectDict = Object.freeze({
  ...AclBaseSubjectEnum,
  ...AclCompositeSubjects,
});

// console.log(AclSubjectTypeDict);
