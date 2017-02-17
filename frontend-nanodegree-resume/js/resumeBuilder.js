var bio = {
    "name": "Wioleta Golebiewska",
    "role": "Sr. Specialist Application Developer",
    "contacts": {
        "email": "wioleta87g@gmail.com",
        "mobile": "708-415-7857",
        "github": "https://github.com/wioletag",
        "location": "Chicago, IL"

    },
    "biopic": "images/biopic.png",
    "welcomeMessage": "Motivated professional. Quick at learning and applying new skills.",
    "skills": ["JavaScript", "HTML", "CSS", "Java", "SQL"],
    display: function() {
        var formattedName = HTMLheaderName.replace("%data%", bio.name);
        var formatteRole = HTMLheaderRole.replace("%data%", bio.role);
        var formattedMobile = HTMLmobile.replace("%data%", bio.contacts.mobile);
        var formattedEmail = HTMLemail.replace("%data%", bio.contacts.email);
        var formattedGithub = HTMLgithub.replace("%data%", bio.contacts.github);
        var formattedLocation = HTMLlocation.replace("%data%", bio.contacts.location);
        var formattedPic = HTMLbioPic.replace("%data%", bio.biopic);
        var formattedMsg = HTMLwelcomeMsg.replace("%data%", bio.welcomeMessage);

        $("#header").prepend(formatteRole);
        $("#header").prepend(formattedName);
        $("#topContacts").append(formattedMobile);
        $("#topContacts").append(formattedEmail);
        $("#topContacts").append(formattedGithub);
        $("#topContacts").append(formattedLocation);
        $("#footerContacts").append(formattedMobile);
        $("#footerContacts").append(formattedEmail);
        $("#footerContacts").append(formattedGithub);
        $("#footerContacts").append(formattedLocation);

        $("#header").append(formattedPic);
        $("#header").append(formattedMsg);

        if (bio.skills.length > 0) {
            $("#header").append(HTMLskillsStart);
            for (var i = 0; i < bio.skills.length; i++) {
                var formattedSkill = HTMLskills.replace("%data%", bio.skills[i]);
                $("#skills").append(formattedSkill);
            }
        }
    }
};

var education = {
    "schools": [{
        "name": "Dominican University",
        "location": "River Forest, IL",
        "degree": "BA",
        "majors": ["Computer Science", "Computer Information Systems"],
        "dates": "2006 - 2010"
    }],
    "onlineCourses": [{
            "title": "Front-End Web Developer Nanodegree",
            "school": "Udemy",
            "dates": "2016 - Present",
            "url": "https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001"
        },
        {
            "title": "Shaping up with Angular.js",
            "school": "Code School",
            "dates": "2016",
            "url": "https://www.codeschool.com/courses/shaping-up-with-angular-js"
        }

    ],
    display: function() {
        education.schools.forEach(function(school) {
            $("#education").append(HTMLschoolStart);
            var formattedName = HTMLschoolName.replace("%data%", school.name);
            var formattedDegree = HTMLschoolDegree.replace("%data%", school.degree);
            var formattedDates = HTMLschoolDates.replace("%data%", school.dates);
            var formattedLocation = HTMLschoolLocation.replace("%data%", school.location);

            $(".education-entry:last").append(formattedName + formattedDegree);
            $(".education-entry:last").append(formattedDates);
            $(".education-entry:last").append(formattedLocation);

            if (school.majors.length > 0) {
                for (var i = 0; i < school.majors.length; i++) {
                    var formattedMajor = HTMLschoolMajor.replace("%data%", school.majors[i]);
                    $(".education-entry:last").append(formattedMajor);
                }
            }
        });
        $("#education").append(HTMLonlineClasses);
        education.onlineCourses.forEach(function(course) {
            $("#education").append(HTMLschoolStart);
            var formattedTitle = HTMLonlineTitle.replace("%data%", course.title);
            var formattedSchool = HTMLonlineSchool.replace("%data%", course.school);
            var formattedDates = HTMLonlineDates.replace("%data%", course.dates);
            var formattedUrl = HTMLonlineURL.replace("%data%", course.url);
            formattedUrl = formattedUrl.replace("#", course.url);
            $(".education-entry:last").append(formattedTitle + formattedSchool);
            $(".education-entry:last").append(formattedDates);
            $(".education-entry:last").append(formattedUrl);
        });
    }
};
var work = {
    "jobs": [{
            "title": "Sr. Specialist Application Developer",
            "employer": "AT&T",
            "dates": "June 2010 - Present",
            "location": "Schaumburg, IL",
            "description": "Work on various internal applications across AT&T. Skills/technologies on previous and current projects include: " +
                "Java, SQL, XML, Eclipse, Spring MVC, HTML, CSS, JavaScript, Bootstrap, JQuery, Dojo Toolkit, Apache Tomcat. " +
                "Investigate/fix defects and provide application support. " +
                "Work in virtual teams."
        },
        {
            "title": "Web Developer",
            "employer": "Freelance",
            "dates": "Feb 2010 - May 2010",
            "location": "Norridge, IL",
            "description": "Developed website using WordPress system in PHP and CSS for Cheese and Cheers. Designed company’s logo."
        },
        {
            "title": "Computer Science Tutor",
            "employer": "Dominican University",
            "dates": "Sept 2008 - May 2010",
            "location": "River Forest, IL",
            "description": "Helped students with computer programming problems and MS office questions."
        },
        {
            "title": "Student Intern Technical",
            "employer": "AT&T",
            "dates": "June 2009 - Sept 2009",
            "location": "Hoffman Estates, IL",
            "description": "Developed reporting and user-administration web-based tools for Business Objects XI R3.1 using Java, JavaScript, HTML, CSS and Business Objects XI R3.1 Java SDK."
        }
    ],
    display: function() {
        work.jobs.forEach(function(job) {
            $("#workExperience").append(HTMLworkStart);
            var formattedEmployer = HTMLworkEmployer.replace("%data%", job.employer);
            var formattedTitle = HTMLworkTitle.replace("%data%", job.title);
            var formattedEmployerTitle = formattedEmployer + formattedTitle;
            var formattedDates = HTMLworkDates.replace("%data%", job.dates);
            var formattedLocation = HTMLworkLocation.replace("%data%", job.location);
            var formattedDesc = HTMLworkDescription.replace("%data%", job.description);

            $(".work-entry:last").append(formattedEmployerTitle);
            $(".work-entry:last").append(formattedDates);
            $(".work-entry:last").append(formattedLocation);
            $(".work-entry:last").append(formattedDesc);
        });
    }
};
var projects = {
    "projects": [{
        "title": "Portfolio Site",
        "dates": "2017",
        "description": "Portfolio site for projects completed throughout the course of the Front-End Web Developer Nanodegree.",
        "images": ["images/portfolio_1.png", "images/portfolio_2.png"],
        "url": "https://github.com/wioletag/portfolio"
    }],
    display: function() {
        projects.projects.forEach(function(project) {
            $("#projects").append(HTMLprojectStart);
            var formattedProjectTitle = HTMLprojectTitle.replace("%data%", project.title);
            formattedProjectTitle = formattedProjectTitle.replace("#", project.url);
            var formattedProjectDates = HTMLprojectDates.replace("%data%", project.dates);
            var formattedTitleProjectDescription = HTMLprojectDescription.replace("%data%", project.description);

            $(".project-entry:last").append(formattedProjectTitle);
            $(".project-entry:last").append(formattedProjectDates);
            $(".project-entry:last").append(formattedTitleProjectDescription);

            if (project.images.length > 0) {
                for (var i = 0; i < project.images.length; i++) {
                    var formattedProjectImage = HTMLprojectImage.replace("%data%", project.images[i]);
                    $(".project-entry:last").append(formattedProjectImage);
                }
            }
        });
    }
};

bio.display();
work.display();
projects.display();
education.display();

$("#mapDiv").append(googleMap);