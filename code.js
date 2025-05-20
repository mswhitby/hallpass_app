function doGet(url) {
    let view = "unknown";
    let role = "unknown";
    let template = "unknown";

    const browserView = (url.parameter.view || "").toLowerCase() 

    const email = Session.getActiveUser().getEmail();
    console.log("view: ", view)

    if (email.startsWith("deandra")) {
        role = "developer";
        view = browserView || role;
    } else if (email.endsWith("@judsonisd.org")) {
        role = "teacher";
        view = browserView || role;
    } else {
        role = "student";
        view = browserView || role;
    }

    switch (view) {
        case "developer":
            template = HtmlService.createTemplateFromFile("teacher/teacher");
            template.teacherEmail = email;
            break;
        case "teacher":
            template = HtmlService.createTemplateFromFile("teacher/teacher");
            template.teacherEmail = email;
            break;
        default:
            template = HtmlService.createTemplateFromFile("student/student");
            break;
    }
    
    // if (view === "developer") {
    //   template = HtmlService.createTemplateFromFile("teacher/teacher");
    //   template.teacherEmail = email;
    // } else if (view === "teacher") {
    //   template = HtmlService.createTemplateFromFile("teacher/teacher");
    //   template.teacherEmail = email;
    // } else {
    //   template = HtmlService.createTemplateFromFile("student/student");
    // }

    template.userEmail = email;
    template.role = role
    console.log(`Email: ${email}; Role: ${role}; View: ${view}`)
    return template.evaluate().setTitle(`Hall Pass Dashboard - ${role}`);
}




















