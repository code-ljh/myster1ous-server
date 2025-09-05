```css
/* ==UserStyle==
@name         Codeforces Best Dark Theme 
@version      20211214.22.29
@namespace    userstyles.world/user/18jad
@description  The best codeforces theme ever made for now, i tried to make sure everything is working fine and displaying correctly, if you find any bug or any visual bug please feel free to tell me to fix it as fast as possible, my codeforces id: 18jad

Thank you for trying out my theme!
@author       18jad
@license      No License
==/UserStyle== */

@-moz-document url-prefix("codeforces.com") {

    body,
    .menu-list-containe,
    .roundbox,
    .roundbox,
    .roundbox .bottom-links,
    #sidebar>div:nth-child(9)>form>div:nth-child(2)>label>input,
    .top,
    .datatable .dark,
    .test-for-popup pre,
    .problem-statement .sample-tests pre,
    .sidebar-menu ul li:hover,
    .sidebar-menu ul li.active,
    .ace-chrome .ace_gutter {
        background: #333;
        color: white;
    }

    .menu-list li a,
    #facebox>div>a,
    .rtable th,
    #sidebar>div:nth-child(1)>table>tbody>tr:nth-child(1)>th>a,
    #sidebar>div:nth-child(1)>table>tbody>tr:nth-child(3)>td>span,
    .sidebar-menu ul a {
        color: #fff !important;
    }

    #pageContent>div.contestList>div.contests-table>div.datatable>div:nth-child(6)>table>tbody>tr:nth-child(2)>td.state.dark>div:nth-child(1)>div {
        color: black;
    }

    div.ttypography,
    .second-level-menu-list li a,
    .MathJax span {
        color: white;
    }

    .sidebar-menu ul li,
    .sidebar-menu ul li.active {
        cursor: pointer;
    }

    .roundbox .dark,
    .datatable td,
    .datatable th,
    #pageContent>div.contestList>div.datatable>div:nth-child(5),
    #pageContent>div.contestList>div.contests-table>div.datatable>div:nth-child(5) {
        background: #4e4d4d;
    }

    .datatable .ilt,
    .datatable .irt,
    .roundbox .roundbox-lt,
    .roundbox .roundbox-rt,
    .roundbox .roundbox-lb,
    .roundbox .roundbox-rb,
    .datatable .lt,
    .datatable .rt,
    .datatable .lb,
    .datatable .rb {
        display: none;
    }

    .roundbox {
        background: #333 !important;
        color: white !important;
    }

    /* Buttons */

    #sidebar>div:nth-child(9)>form>div:nth-child(3)>input[type=submit],
    #sidebar>div:nth-child(8)>div:nth-child(4)>div:nth-child(2)>form>input[type=submit]:nth-child(2),
    #sidebar>div:nth-child(2)>div:nth-child(4)>div>form.searchContestByNameOrIdForm>div>input,
    #gym-filter-form>div:nth-child(20)>input[type=submit],
    #sidebar>div:nth-child(2)>div:nth-child(4)>div:nth-child(2)>form>input[type=submit],
    #sidebar>div:nth-child(5)>div:nth-child(4)>div:nth-child(2)>form>input[type=submit]:nth-child(4),
    #sidebar>div:nth-child(7)>div:nth-child(4)>form>table>tbody>tr:nth-child(4)>td>div>div>input,
    #pageContent>form>table>tbody>tr:nth-child(6)>td>div>div>input,
    #sidebar>div.roundbox.sidebox._FilterByTagsFrame_main>div:nth-child(5)>form>div._FilterByTagsFrame_button>input[type=submit] {
        background: #333;
        border: 1px solid white;
        border-radius: 6px;
        color: white;
        cursor: pointer;
    }

    /* Search */

    #searchByNameOrIdQueryBox,
    .search,
    #tabSizeInput,
    #sidebar>div.roundbox.sidebox._FilterByTagsFrame_main>div:nth-child(5)>form>div._FilterByTagsFrame_difficulty>label>span>input:nth-child(1),
    #sidebar>div.roundbox.sidebox._FilterByTagsFrame_main>div:nth-child(5)>form>div._FilterByTagsFrame_difficulty>label>span>input:nth-child(2) {
        background: #333;
        border: 1px solid white;
        color: white;
        border-radius: 6px;
    }

    /* Selector */

    #filterSeasonUpperBorder,
    #filterSeasonLowerBorder,
    #filterContestType,
    #filterContestFormat,
    #filterDurationLowerBorder,
    #filterDurationUpperBorder,
    #order,
    #additionalOrder,
    #sidebar>div:nth-child(7)>div:nth-child(4)>form>table>tbody>tr:nth-child(1)>td:nth-child(2)>select,
    #pageContent>form>table>tbody>tr:nth-child(1)>td:nth-child(2)>label>select,
    #pageContent>form>table>tbody>tr:nth-child(3)>td:nth-child(2)>select,
    #typeSelectForm>label>select,
    #pageContent>div._UserActivityFrame_frame>div>div._UserActivityFrame_header>div>label>select {
        background: #333;
        color: white;
        border-radius: 5px;
    }

    #pageContent>div.contestList>div.datatable>div:nth-child(5),
    #pageContent>div.contestList>div.contests-table>div.datatable>div:nth-child(5) {
        padding: 10px;
        height: 25px;
        margin-bottom: 10px;
    }

    .roundbox,
    #pageContent>div.contestList>div.contests-table>div>div:nth-child(5),
    #pageContent>div.contestList>div.datatable>div:nth-child(5),
    #editor {
        border-radius: 13px;
    }

    .ace_scroller {
        background: #938f8f63;
    }

    #facebox .content,
    #facebox>div>a {
        background: black !important;
    }

    #facebox>div>div>div>pre>code>ol {
        background: #2d2a2a45;
    }

    #facebox>div>a>img {
        filter: invert(200%);
    }

    .verdict-accepted {
        color: lime;
        font-weight: bold;
        font-size: 12px;
    }

    .verdict-rejected {
        color: red;
        font-weight: bold;
        font-size: 10px;
        white-space: nowrap;
    }

    .cell-rejected {
        color: red;
    }

    .problems .accepted-problem td.act {
        background: #58e258 !important;
    }

    .problems .rejected-problem td.id {
        border-left: 6px solid #ee4c4c !important;
    }

    .problems .accepted-problem td.id {
        border-left: 6px solid #58e258 !important;
    }

    .submissionVerdictWrapper {
        color: black;
        font-weight: bold;
        font-size: 10px;
    }

    .problems .rejected-problem td.act {
        background: #ee4c4c !important;
    }

    .status-cell {
        background: #333 !important;
    }

    a {
        color: #9e9ed6 !important;
    }

    a:hover {
        color: #99d3e4bbaf !important;
    }

    rect[data-items=""] {
        fill: #4d4c4ce3;
        /*     border: 1px solid white; */
    }

    .second-level-menu-list li.backLava {
        filter: brightness(10%);
        border-radius: 10px;
        /*     border: 10px solid white; */
        /*     box-shadow: 0px 0px 5px 5px white; */
    }

    .user-red,
    .user-legendary {
        color: #f74545 !important;
    }

    .rated-user {
        text-shadow: 0px 2px 2px #171717;
    }

    .user-gray {
        color: #bdbcbc !important;
    }

    .highlighted-row td,
    .highlighted-row th {
        background: #353434 !important;
        border: 2px solid #75e3c6;
    }

    #pageContent>div.contestList>div.datatable>div:nth-child(6)>table>tbody>tr:nth-child(1)>th.top.left {
        background: #333;
    }

    #pageContent>div.contestList>div.contests-table>div,
    #pageContent>div.contestList>div.datatable,
    #facebox>div>div>div>div>div,
    #pageContent>div.datatable {
        background: #333 !important;
        border: 1px solid white;
        border-radius: 3px;
    }

    .pagination span.active {
        background: #2a2a2a;
        border-radius: 10px;
    }

    /* IMAGE */

    #header img:first-of-type,
    #vote-list-filterDifficultyLowerBorder,
    #vote-list-filterDifficultyUpperBorder,
    #footer>div:nth-child(7)>a:nth-child(1)>img,
    #sidebar>div.roundbox.sidebox.sidebar-menu>ul>li:nth-child(1)>span:nth-child(2)>img,
    #sidebar>div.roundbox.sidebox.sidebar-menu>ul>li:nth-child(2)>span:nth-child(2)>img {
        filter: invert(80%);
    }

    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: #333;
        box-shadow: inset 0 0 5px grey;
    }

    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    .legendary-user-first-letter {
        -webkit-text-fill-color: #eeeeeeaa;
    }

    .user-4000,
    .user-admin {
        color: #eeeeeeaa !important;
    }

    .user-violet {
        color: #d880d8 !important;
    }

    .user-green {
        color: #74c374 !important;
    }

    .user-cyan {
        color: #74d1c3 !important;
    }

    .com {
        color: #c36060 !important;
    }

    .pln {
        color: white !important;
    }

    .pun {
        color: #db9b9b !important;
    }

    .kwd {
        color: #7e93dc !important;
    }

    .typ {
        color: #e2cd7f !important;
    }

    .caption {
        color: #9696d4 !important;
    }

    .lit {
        color: lightblue !important;
    }

    .user-blue {
        color: #37ceff !important;
    }

    button,
    input {
        background-color: #3c3c3caa !important;
        color: #eeeeeeaa !important;
        padding: 5px 2px !important;
        font-family: 'Consolas';
    }

    .topic .title * {
        color: #94e1ffaa !important;
    }

    .test-example-line-even:hover {
        background-color: #3c1313 !important;
    }

    .test-example-line-even {
        background-color: black !important;
    }

    .test-example-line-odd:hover {
        background-color: #3b2e2e !important;
    }

    .test-example-line-odd {
        background-color: #3c3c3c !important;
    }
}
```