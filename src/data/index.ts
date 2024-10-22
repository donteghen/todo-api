const constants = {
    USER_ROLE : {
        ADMIN: 'admin' ,
        TEAM_LEAD: 'teamLead',
        TEAM_USER:'teamUser'
    },
    TODO_STATUS: {
        READY: 'ready',
        ON_GOING: 'ongoing',
        DONE: 'done'
    }
}

const errorOptions = {
    healthCheckFailed: {
        message: 'Health check failed! Please review the code base and release a fix.'
    }
}

const successOptions = {
    healthCheckFailed: {
        message: 'Health check failed! Please review the code base and release a fix.'
    }
}
export {constants, errorOptions, successOptions};