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

export enum AcpCompositeSubjectEnum {
  Organization = 'Organization',
  Security = 'Security',
  Finance = 'Finance',
}

export const AcpGroupedSubjects = Object.freeze({
  [AcpCompositeSubjectEnum.Organization]: [
    AcpBaseSubjectEnum.Organization,
    AcpBaseSubjectEnum.User,
  ],
  [AcpCompositeSubjectEnum.Security]: [
    AcpCompositeSubjectEnum.Security,
    AcpBaseSubjectEnum.Role,
    AcpBaseSubjectEnum.Policy,
    AcpBaseSubjectEnum.Subject,
    AcpBaseSubjectEnum.Ability,
  ],
  [AcpCompositeSubjectEnum.Finance]: [
    AcpCompositeSubjectEnum.Finance,
    AcpBaseSubjectEnum.Payment,
    AcpBaseSubjectEnum.CreditCard,
    AcpBaseSubjectEnum.Invoice,
  ],
});

export const AcpCompositeSubjects = Object.freeze({
  [AcpCompositeSubjectEnum.Organization]: [
    ...AcpGroupedSubjects[AcpCompositeSubjectEnum.Organization],
    ...AcpGroupedSubjects[AcpCompositeSubjectEnum.Security],
    ...AcpGroupedSubjects[AcpCompositeSubjectEnum.Finance],
  ],
  [AcpCompositeSubjectEnum.Security]: [
    ...AcpGroupedSubjects[AcpCompositeSubjectEnum.Security],
  ],
  [AcpCompositeSubjectEnum.Finance]: [
    ...AcpGroupedSubjects[AcpCompositeSubjectEnum.Finance],
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
