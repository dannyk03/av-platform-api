export enum AcpBaseSubjectEnum {
  Organization = 'Organization',
  User = 'User',
  Policy = 'Policy',
  Role = 'Role',
  Subject = 'Subject',
  Ability = 'Ability',
  CreditCard = 'CreditCard',
  Invoice = 'Invoice',
}

export enum AcpSubjectGroupEnum {
  Organization = 'Organization',
  Security = 'Security',
  Payment = 'Payment',
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
    AcpBaseSubjectEnum.Role,
    AcpBaseSubjectEnum.Policy,
    AcpBaseSubjectEnum.Subject,
    AcpBaseSubjectEnum.Ability,
  ],
  [AcpSubjectGroupEnum.Payment]: [
    AcpBaseSubjectEnum.CreditCard,
    AcpBaseSubjectEnum.Invoice,
  ],
});

export const AcpCompositeSubjects = Object.freeze({
  [AcpCompositeSubjectEnum.Organization]: [
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Organization],
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Security],
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Payment],
  ],
  [AcpCompositeSubjectEnum.Security]: [
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Security],
  ],
  [AcpCompositeSubjectEnum.Finance]: [
    ...AcpGroupedSubjects[AcpSubjectGroupEnum.Payment],
  ],
});

export const AcpSubjectTypeDict = Object.freeze({
  ...AcpBaseSubjectEnum,
  ...AcpCompositeSubjectEnum,
});

export type AcpSubjectTypeEnum = AcpBaseSubjectEnum | AcpCompositeSubjectEnum;

export const AcpSubjectDict = Object.freeze({
  ...AcpBaseSubjectEnum,
  ...AcpCompositeSubjects,
});
