export enum AcpBaseSubjectEnum {
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

export enum AcpNamespaceSubjectEnum {
  OrganizationNamespace = 'OrganizationNamespace',
  SecurityNamespace = 'SecurityNamespace',
  FinanceNamespace = 'FinanceNamespace',
  GiftingNamespace = 'GiftingNamespace',
}

export const AcpNamespaceSubjects = Object.freeze({
  [AcpNamespaceSubjectEnum.OrganizationNamespace]: [
    ...Object.values(AcpBaseSubjectEnum),
    ...Object.values(AcpNamespaceSubjectEnum),
  ],
  [AcpNamespaceSubjectEnum.SecurityNamespace]: [
    AcpBaseSubjectEnum.Role,
    AcpBaseSubjectEnum.Policy,
    AcpBaseSubjectEnum.Subject,
    AcpBaseSubjectEnum.Ability,
  ],
  [AcpNamespaceSubjectEnum.FinanceNamespace]: [
    AcpBaseSubjectEnum.Payment,
    AcpBaseSubjectEnum.CreditCard,
    AcpBaseSubjectEnum.Invoice,
  ],
  [AcpNamespaceSubjectEnum.GiftingNamespace]: [AcpBaseSubjectEnum.Gift],
});

export const AcpCompositeSubjects = Object.freeze({
  [AcpNamespaceSubjectEnum.OrganizationNamespace]: [
    ...new Set([
      AcpNamespaceSubjectEnum.OrganizationNamespace,
      ...AcpNamespaceSubjects[AcpNamespaceSubjectEnum.OrganizationNamespace],
      ...AcpNamespaceSubjects[AcpNamespaceSubjectEnum.SecurityNamespace],
      ...AcpNamespaceSubjects[AcpNamespaceSubjectEnum.FinanceNamespace],
      ...AcpNamespaceSubjects[AcpNamespaceSubjectEnum.GiftingNamespace],
    ]),
  ],
  [AcpNamespaceSubjectEnum.SecurityNamespace]: [
    ...new Set([
      AcpNamespaceSubjectEnum.SecurityNamespace,
      ...AcpNamespaceSubjects[AcpNamespaceSubjectEnum.SecurityNamespace],
    ]),
  ],
  [AcpNamespaceSubjectEnum.FinanceNamespace]: [
    ...new Set([
      AcpNamespaceSubjectEnum.FinanceNamespace,
      ...AcpNamespaceSubjects[AcpNamespaceSubjectEnum.FinanceNamespace],
    ]),
  ],
  [AcpNamespaceSubjectEnum.GiftingNamespace]: [
    ...new Set([
      AcpNamespaceSubjectEnum.GiftingNamespace,
      ...AcpNamespaceSubjects[AcpNamespaceSubjectEnum.GiftingNamespace],
    ]),
  ],
});

export const AcpSubjectTypeDict = Object.freeze({
  ...AcpBaseSubjectEnum,
  ...AcpNamespaceSubjectEnum,
});

export type AcpSubjectType = AcpBaseSubjectEnum | AcpNamespaceSubjectEnum;

export const AcpSubjectDict = Object.freeze({
  ...AcpBaseSubjectEnum,
  ...AcpCompositeSubjects,
});

// console.log(AcpSubjectDict);
