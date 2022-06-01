export const E2E_PERMISSION_ADMIN_LIST_URL = '/admin/permission/list';
export const E2E_PERMISSION_ADMIN_GET_URL = '/admin/permission/get/:_id';
export const E2E_PERMISSION_ADMIN_UPDATE_URL = '/admin/permission/update/:_id';
export const E2E_PERMISSION_ADMIN_ACTIVE_URL =
    '/admin/permission/update/:_id/active';
export const E2E_PERMISSION_ADMIN_INACTIVE_URL =
    '/admin/permission/update/:_id/inactive';

export const E2E_PERMISSION_PAYLOAD_TEST = {
    role: {
        name: 'ADMIN',
        isActive: true,
        permissions: [
            {
                code: 'PERMISSION_READ',
                isActive: true,
            },
            {
                code: 'PERMISSION_UPDATE',
                isActive: true,
            },
            {
                code: 'PERMISSION_DELETE',
                isActive: true,
            },
            {
                code: 'PERMISSION_CREATE',
                isActive: true,
            },
            {
                code: 'PERMISSION_INACTIVE',
                isActive: true,
            },
            {
                code: 'PERMISSION_ACTIVE',
                isActive: true,
            },
        ],
    },
    phoneNumber: '378123123137',
    email: 'test@avonow.com',
    _id: '613ee8e5b2fdd012b94484ca',
    user: '6141b7d9b8822a162d427323',
    rememberMe: false,
    loginWith: 'EMAIL',
    isActive: true,
    verification: { email: true, phoneNumber: true },
    agreement: {
        tnc: true,
    },
    signUpFrom: 'MOBILE',
    signUpDate: '2021-9-13',
};
