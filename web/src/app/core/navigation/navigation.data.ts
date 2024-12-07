import { HelperNavigationItem } from 'helper/components/navigation';

const generalManagerNavigation: HelperNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/dashboard',
    },
    {
        id: 'branch',
        title: 'សាខា',
        type: 'basic',
        icon: 'heroicons_outline:building-office-2',
        link: '/branch',
    },
    {
        id: 'payment',
        title: 'ការបង់ប្រាក់',
        type: 'basic',
        icon: 'mat_outline:attach_money',
        link: '/payment',
    },
    {
        id: 'student',
        title: 'សិស្ស',
        type: 'basic',
        icon: 'mdi:account-school-outline',
        link: '/student',
    },
    {
        id: 'teacher',
        title: 'គ្រូបង្រៀន',
        type: 'basic',
        icon: 'mat_outline:person',
        link: '/teacher',
    },
    {
        id: 'year',
        title: 'ឆ្នាំសិក្សា',
        type: 'basic',
        icon: 'mat_solid:account_tree',
        link: '/year',
    },
    {
        id: 'program',
        title: 'កម្មវិធីសិក្សា',
        type: 'basic',
        icon: 'mat_outline:school',
        link: '/program'
    },
    {
        id: 'report',
        title: 'របាយការណ៍',
        type: 'collapsable',
        icon: 'feather:activity',
        children: [
            {
                id: 'report.transaction',
                title: 'ប្រតិបត្តិការ',
                type: 'basic',
                link: '/report/transaction',
            },
            {
                id: 'report.finance',
                title: 'ហិរញ្ញវត្ថុ',
                type: 'basic',
                link: '/report/finance',
            },
            {
                id: 'report.teacher',
                title: 'គ្រូបង្រៀន',
                type: 'basic',
                link: '/report/teacher',
            }
        ]
    },
    {
        id: 'settings',
        title: 'ការកំណត់',
        type: 'collapsable',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'settings.info',
                title: 'ព័ត៌មានសាលា',
                type: 'basic',
                link: '/settings/info',
            },
            {
                id: 'settings.subject',
                title: 'ប្រភេទកម្មវិធីសិក្សា',
                type: 'basic',
                link: '/settings/subject',
            },
            {
                id: 'settings.level',
                title: 'កម្រិតសិក្សា',
                type: 'basic',
                link: '/settings/level',
            },
            {
                id: 'settings.step',
                title: 'ដំណាក់កាលទូទាត់',
                type: 'basic',
                link: '/settings/step',
            },
            {
                id: 'settings.discount',
                title: 'បញ្ចុះតម្លៃ',
                type: 'basic',
                link: '/settings/discount',
            },
            {
                id: 'settings.source',
                title: 'ប្រភពចំណូល',
                type: 'basic',
                link: '/settings/source',
            }
        ]
    }
];

const principalNavigation: HelperNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/principal/dashboard',
    },
    {
        id: 'class',
        title: 'ថ្នាក់រៀន',
        type: 'basic',
        icon: 'heroicons_outline:building-office-2',
        link: '/principal/class',
    },
    {
        id: 'teacher',
        title: 'គ្រូបង្រៀន',
        type: 'basic',
        icon: 'mat_outline:person',
        link: '/principal/teacher',
    },
    {
        id: 'staff',
        title: 'បុគ្គលិក',
        type: 'basic',
        icon: 'mat_outline:people',
        link: '/principal/staff',
    },
    {
        id: 'year',
        title: 'ឆ្នាំសិក្សា',
        type: 'basic',
        icon: 'mat_solid:account_tree',
        link: '/principal/year',
    },
    {
        id: 'payment',
        title: 'ការបង់ប្រាក់',
        type: 'basic',
        icon: 'mat_outline:attach_money',
        link: '/principal/payment',
    },
    {
        id: 'report',
        title: 'របាយការណ៍',
        type: 'collapsable',
        icon: 'feather:activity',
        children: [
            {
                id: 'report.transaction',
                title: 'ប្រតិបត្តិការ',
                type: 'basic',
                link: '/principal/report/transaction',
            },
            {
                id: 'report.finance',
                title: 'ហិរញ្ញវត្ថុ',
                type: 'basic',
                link: '/principal/report/finance',
            },
            {
                id: 'report.evaluation',
                title: 'ការវាយតម្លៃ',
                type: 'basic',
                link: '/principal/report/evaluation',
            }
        ]
    },
    {
        id: 'settings',
        title: 'ការកំណត់',
        type: 'collapsable',
        icon: 'heroicons_outline:cog-8-tooth',
        children: [
            {
                id: 'settings.room',
                title: 'បន្ទប់រៀន',
                type: 'basic',
                link: '/principal/settings/room',
            }
        ]
    }
];

const accountantNavigation: HelperNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/accountant/dashboard',
    },
    {
        id: 'payment',
        title: 'ការបង់ប្រាក់',
        type: 'basic',
        icon: 'mat_outline:attach_money',
        link: '/accountant/payment',
    },
    // {
    //     id: 'report',
    //     title: 'របាយការណ៍',
    //     type: 'basic',
    //     icon: 'feather:activity',
    //     link: '/accountant/report',
    // },
    {
        id: 'setting',
        title: 'ការកំណត់',
        type: 'basic',
        icon: 'heroicons_outline:cog-8-tooth',
        link: '/accountant/setting'
    }
];

const receptionistNavigation: HelperNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/receptionist/dashboard',
    },
    {
        id: 'student',
        title: 'សិស្ស',
        type: 'basic',
        icon: 'mdi:account-school-outline',
        link: '/receptionist/students/listing',
    },
    // {
    //     id: 'report',
    //     title: 'របាយការណ៍',
    //     type: 'basic',
    //     icon: 'feather:activity',
    //     link: '/receptionist/report',
    // }
];

const teacherNavigation: HelperNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/teacher/dashboard',
    },
    {
        id: 'class-room',
        title: 'ថ្នាក់បង្រៀន',
        type: 'basic',
        icon: 'mat_outline:door_front',
        link: '/teacher/class-room',
    },
    {
        id: 'schedule',
        title: 'កាលវិភាគ',
        type: 'basic',
        icon: 'feather:calendar',
        link: '/teacher/schedule',
    },
    // {
    //     id: 'report',
    //     title: 'របាយការណ៍',
    //     type: 'basic',
    //     icon: 'feather:activity',
    //     link: '/teacher/report',
    // }
];

const parentNavigation: HelperNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'ផ្ទាំងព័ត៌មាន',
        type: 'basic',
        icon: 'mat_outline:dashboard',
        link: '/parent/dashboard',
    },
    {
        id: 'payment',
        title: 'ការបង់ប្រាក់',
        type: 'basic',
        icon: 'mat_outline:attach_money',
        link: '/parent/payment',
    },
];


export const navigationData = {
    manager: generalManagerNavigation,
    principal: principalNavigation,
    accountant: accountantNavigation,
    receptionist: receptionistNavigation,
    teacher: teacherNavigation,
    parent: parentNavigation
}
