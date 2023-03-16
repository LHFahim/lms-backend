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
        findOneDiscussion: ':bookId',

        updateDiscussion: ':id',
        deleteDiscussion: ':id',
    },
    [ControllersEnum.Status]: {
        findAllStatus: '',
    },
    [ControllersEnum.Settings]: {
        updateNotificationSettings: 'notifications',
    },
    [ControllersEnum.Books]: {
        findSearchedBooks: '/search',
        findBooks: '',
        findOneBook: ':id',
        borrowOneBook: ':id/borrow',
        returnOneBook: ':id/return',
        findFilteredBooks: '/filter',
    },
    [ControllersEnum.Wallet]: {
        createWallet: '',
        findOneWallet: ':id',
        reduceBalance: ':id/reduce',
    },
    [ControllersEnum.BorrowBooks]: {
        findBorrowedBooks: '',
        findReturnedBooks: 'returned-books',
        extendBorrowedBooksDuration: ':id/extend-duration',
        extendBorrowedBooksLimit: 'extend-limit',
    },
    [ControllersEnum.BorrowRequestBooks]: {
        requestToBorrow: ':bookId/request-to-borrow',
        findAllBorrowedRequests: '',
    },
    [ControllersEnum.UserInterests]: {
        findUserInterests: '',
    },
    [ControllersEnum.Comment]: {
        createComment: ':bookId/:discussionId',
        findComments: ':discussionId',
        deleteComment: ':discussionId/:id',
    },
    [ControllersEnum.WaitingList]: {
        createWaitingList: ':bookId',
    },
    [ControllersEnum.DonateBook]: {
        donateBook: 'donate',
        findDonatedBooks: '',
        findUserDonatedBooks: 'user-donated',
        addDonatedBookToSystem: ':id',
    },

    // admin routes below
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

        restockOneBook: ':id/restock',
    },
    [ControllersEnum.AdminWallet]: {
        updateWallet: ':id',
        fineWallet: ':id',
    },
    [ControllersEnum.AdminBorrowBooks]: {
        findAllBorrowedBooks: '',
        acceptReturnBook: ':bookId/:borrowerId/accept',
        approveRequest: ':bookId/:requesterId/approve',
        declineRequest: ':bookId/:requesterId/decline',
    },
};
