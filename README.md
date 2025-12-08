sequenceDiagram
actor User
participant Client
participant AuthRoutes as Auth Routes
participant AuthCtrl as Auth Controller
participant DB as Database

    rect rgb(230, 245, 255)
    Note over User,DB: Login Flow
    User->>Client: POST /login (credentials)
    Client->>AuthRoutes: route request
    AuthRoutes->>AuthCtrl: login(req, res)
    AuthCtrl->>DB: validate credentials
    alt Valid Credentials
        DB-->>AuthCtrl: user data
        AuthCtrl->>AuthCtrl: issue JWT token
        AuthCtrl-->>Client: token + user data
        Client-->>User: success
    else Invalid Credentials
        DB-->>AuthCtrl: ∅
        AuthCtrl-->>Client: invalid credentials error
        Client-->>User: error
    end
    end

    rect rgb(245, 230, 255)
    Note over User,DB: Logout Flow
    User->>Client: POST /logout
    Client->>AuthRoutes: route request
    AuthRoutes->>AuthCtrl: logout(req, res)
    AuthCtrl->>AuthCtrl: clear JWT cookie
    AuthCtrl-->>Client: success message
    Client-->>User: logged out
    end
