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
}

export enum AcpSubjectGroupEnum {
  Organization = 'Organization',
  Security = 'Security',
  Finance = 'Finance',
}

export enum AcpCompositeSubjectEnum {
  Organization = 'Organization',
  Security = 'Security',
  Finance = 'Finance',
}

export const AcpGroupedSubjects = Object.freeze({
  [AcpSubjectGroupEnum.Organization]: [
    AcpBaseSubjectEnum.Organization,
    AcpBaseSubjectEnum.User,
  ],
  [AcpSubjectGroupEnum.Security]: [
    AcpSubjectGroupEnum.Security,
    AcpBaseSubjectEnum.Role,
    AcpBaseSubjectEnum.Policy,
    AcpBaseSubjectEnum.Subject,
    AcpBaseSubjectEnum.Ability,
  ],
  [AcpSubjectGroupEnum.Finance]: [
    AcpSubjectGroupEnum.Finance,
    AcpBaseSubjectEnum.Payment,
    AcpBaseSubjectEnum.CreditCard,
    AcpBaseSubjectEnum.Invoice,
  ],
});

export const AcpCompositeSubjects = Object.freeze({
  [AcpCompositeSubjectEnum.Organization]: [
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Organization],
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Security],
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Finance],
  ],
  [AcpCompositeSubjectEnum.Security]: [
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Security],
  ],
  [AcpCompositeSubjectEnum.Finance]: [
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Finance],
  ],
});

export const AcpSubjectTypeDict = Object.freeze({
  ...AcpBaseSubjectEnum,
  ...AcpCompositeSubjectEnum,
});

export type AcpSubjectType = AcpBaseSubjectEnum | AcpCompositeSubjectEnum;

export const AcpSubjectDict = Object.freeze({
  ...AcpBaseSubjectEnum,
  ...AcpCompositeSubjects,
});

console.log({ AcpSubjectDict });
