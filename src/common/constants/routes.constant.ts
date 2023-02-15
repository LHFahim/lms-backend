import { ControllersEnum } from '../enums';

export const Routes = {
    [ControllersEnum.Auth]: {
        register: 'register',
        registerFacebook: 'register/facebook',
        registerGoogle: 'register/google',
        registerRedirect: 'register/redirect',
        login: 'login',
        loginFacebook: 'login/facebook',
        loginGoogle: 'login/google',
        loginRedirect: 'login/redirect',
        refreshJwtToken: 'refresh/jwt-token',
        verifyEmail: 'verify-email',
        sendVerificationEmail: 'verify-email/send',
        changePassword: 'change-password',
        resetPasswordSendCode: 'reset-password/send',
        resetPassword: 'reset-password',
        myProfile: 'me',
        myProfileUpdate: 'me/update',
        myProfileUpdateAvatar: 'me/avatar',
        sendRegistrationOtp: 'send-registration-otp',

        changeEmailSendCode: 'change-email/send',
        changeEmailVerifyCode: 'change-email/verify',
    },
    [ControllersEnum.Roles]: {
        list: '',
    },

    [ControllersEnum.Otps]: {
        send: '',
        verify: 'verify/msisdn',
        verifyTwoStepAuth: 'verify/two-step-auth',
        resendTwoStepAuth: 'resend/two-step-auth',
        verifyEmailVerificationLink: 'verify/email-verification-link',
        resendEmailVerificationLink: 'resend/email-verification-link',
    },
    [ControllersEnum.Todo]: {
        createTodo: '',
        getTodos: '',
        getOneTodo: ':id',
        modifyTodo: ':id',
        deleteTodo: ':id',
        markTodoComplete: ':id/complete',
    },

    [ControllersEnum.Discussion]: {
        createDiscussion: '',
        createDiscussionForProject: 'project/:projectId',
        createDiscussionForProjectMilestone: 'project/:projectId/milestone/:milestoneId',

        updateDiscussion: ':id',
        deleteDiscussion: ':id',
    },
    [ControllersEnum.Status]: {
        findAllStatus: '',
    },
    [ControllersEnum.AdminStatus]: {
        createStatus: '',
        findAllStatuses: '',
        updateStatus: ':id',
        deleteStatus: ':id',
    },

    [ControllersEnum.AdminUsers]: {
        createUser: '',
        findAllAdminUsers: 'admin-users',
        findAllClientUsers: 'client-users',
        blockClientUser: ':id',
    },
    [ControllersEnum.AdminClients]: {
        findAllClientUsers: 'client-users',
        blockClientUser: ':id',
    },
    [ControllersEnum.Settings]: {
        updateNotificationSettings: 'notifications',
    },
    [ControllersEnum.AdminAuth]: {
        register: 'register',

        login: 'login',

        refreshJwtToken: 'refresh/jwt-token',
        verifyEmail: 'verify-email',
        sendVerificationEmail: 'verify-email/send',
        changePassword: 'change-password',
        resetPassword: 'reset-password',
        myProfile: 'me',
        myProfileUpdate: 'me/update',
        myProfileUpdateAvatar: 'me/avatar',
        sendRegistrationOtp: 'send-registration-otp',
        resetPasswordSendCode: 'reset-password/send',
        changeEmailSendCode: 'change-email/send',
        changeEmailVerifyCode: 'change-email/verify',
    },
    [ControllersEnum.AdminBooks]: {
        addBook: '',
        findBooks: '',
        findOneBook: ':id',
        updateOneBook: ':id',
        deleteOneBook: ':id',
        borrowOneBook: ':id/borrow',
        returnOneBook: ':id/return',
    },
};
