// ==UserScript==
// @author      Deathwing
// @name        Anime Website Buttons Plus
// @include     https://www.anime-planet.com/anime/*
// @include     http://myanimelist.net/anime/*
// @include     https://myanimelist.net/anime/*
// @include     https://anilist.co/anime/*
// @include     https://anilist.co/search/*
// @exclude     https://www.anime-planet.com/anime/
// @exclude     https://www.anime-planet.com/anime/all?name=*
// @exclude     https://www.anime-planet.com/anime/recommendations/*
// @description A script that adds buttons on Anime Planet, MAL and Anilist for searching various sites.
// @version     2.5.7
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @namespace   https://greasyfork.org/users/18375
// ==/UserScript==


//Find h1
var header;
var host = document.location.host;
var malHost = 'myanimelist.net';
var apHost = 'www.anime-planet.com';
var alHost = 'anilist.co';

var hideList = [];

var buttDivLeft = 0;
var autoHide = GM_getValue('setting:autoHide', false);

var iconEyeGray = 'https://previews.dropbox.com/p/thumb/AAuWCCOL6JyGmMweL1F-_5DiAS2zJYRa5Lir0SbwC5DvS_0nQEwjuJvONWL8a5aBxxvBhMbmATHXk6HOq_p16qq_FCjHezpZK-WG59CrRBfTl2mY7-e1lE-Ce2r1JEgpQFmo0LllAXnpcbeH7-68AxkfuMN4g6ChfpHCoaX7r9YH8MCQVu01ect1cCdqHDYlJBqgRWUrbTjwrlIlV9Y545Eldz5Xp948EIoHnNVeov_ybS2u-oGDZWwFtN5FLGCtJTyXK2sLylpQ8cvH7DVl0DAVcGO0YF6_RqIwbCpt-yCS58gfClH3lTEmPKunqrBwfNQe0SxXvyXTr-1GbCDiP_Lq/p.png?size=2048x1536&size_mode=3';
var iconEye = 'https://previews.dropbox.com/p/thumb/AAvAf0hVyAwc9SRprGbA731CezYJ5amifW_2ApUxlRa0i98WlQoS13M3EQNGLv9kNTHsle6RsiUTlNZPtimWZM1ccs4i0orerrn0SwuPcsaGnU0cKho2IWWE-mEAhhoh779w04r8yWqJrAZZcYiy1mLZINV6SKIRq797-RW0gsZXZ8tgvcWa_nIAF2cpttnklJ93I0h2FFtmlrdX7WCzUBo2eML71mGMfRebI4b9wYnfFNT_77xWPeA1RoOaFLkYBKWF3wIsfnSCVGjodq_yHC6xjJJ2mwSbiRxuTO0glpiiT0AGN3hUTD0th5IbY5EPF-R4H1zPJMnPScAKax9RlrW5/p.png?fv_content=true&size_mode=5';
var arrowIcon = 'https://previews.dropbox.com/p/thumb/AAu9RWVjB27yYf1IBTB2kIUi34QfZswYDWKQ4e5_vutzZSLP6q0ju6FtFEo6uqIoRbIy3yS2DxS6iiKhJP7rwtbbaWmNqdFBA1gmw4Xk7wAU3stUxDgxTXfGPW5lAI6af3ndevX2PRm4aqPcE_jcvWtP6CdKGOCW08b1ej4dxF6i62M97T96fered6dQYu7xw8HtuXsuHG1wndmjr71iwgGYOa40ucoHunZ-SkPiUqy6PQkG3frzFn8fTvaee1gR_8Jx5Be_lwh3A9so8ZvCaODcjuJYL54OzfUm9o19jKbpWVEnDQuwMIACydwIbxmRxy8IOtPzVm303mOT8Y1rONnT/p.png?size=2048x1536&size_mode=3';
var editIcon = 'https://previews.dropbox.com/p/thumb/AAs_uEIlA0XGqQKA3-9SaVvSNTEfLD9T59ZRlYGPzHmrabhLYbrFL_7v07jrFvFwmHhfCyYTmwFjeC-00XVF7LE4zkSnA7q1f_dvUrhH-M9rDEL7ZaqzQLC_2lO3oxevjm235o8NS3R3-fBVijSrtHcdKgG_0B3FnCEYM5LHkvZO6P0HbrQQ2gmwo4m4JE4EbD44oSCMXcGqy0kU5kzBtKFgbP57Cv-k9HHw3SnNNsFiPC9HGRIiYA9PhCAjxFzy8gRFJlWwR5V7iIJJq9-ImQ_FLxlX_bn27k7IexLJvWHaf4UmK3nifCisIb0oMVUeyBfBhXd04kIVfmwFnwXgjnud/p.png?size=2048x1536&size_mode=3';


if (host === apHost) {
    header = getElement("#siteContainer h1");
    main();
}
else if (host === malHost) {
    header = getElement('#contentWrapper span span');
    main();
}
else if (host === alHost) {
    getAlHeader();
}

function getAlHeader() {
    header = getElement('div.content h1');

    if (header) {
        main();
    }
    else {
        setTimeout(getAlHeader, 300);
    }
}

function getElement(atr) {
    return document.querySelector(atr);
}



function main() {

    //Cut anime name
    var animeName;

    if (host === apHost) {
        animeName = getAnimeName();
    }
    else if (host === malHost) {
        animeName = header.childNodes[0].nodeValue;
    }
    else if (host === alHost) {
        animeName = getAnimeName();
        document.addEventListener('click', () => {
            if (getAnimeName() !== animeName) {
                animeName = getAnimeName();
                var urlsObjs = setSearchURLs();
                var animeButtons = document.querySelectorAll('.animeButton');
                var customButtonsObjs = getAnimeButtonsFromStorage();

                animeButtons.forEach(b => {
                    if (b.className.includes('stockButton')) {
                        b.href = urlsObjs.find(o => `animeButton${makeButtonId(o.n)}` === b.id).u;
                    }
                    else {
                        b.href = customButtonsObjs.find(o => `animeButton${makeButtonId(o.title)}` === b.id).url.replace('ANIMENAME', animeName);
                    }
                });
            }
        });
    }


    function getAnimeName() {
        return header.textContent.trim();
    }


    function creteButton(icon, searchUrl, title, isStock) {
        var buttImg = createHTMLElement("img", null, null, [{ n: 'style', v: 'width:16px;height:16px;margin-right:2px;' }]);

        if (icon) {
            buttImg.src = icon;
        }
        else {
            buttImg.src = getIconUrl(searchUrl);
        }

        var button = createHTMLElement("a", null, 'animeButton', [{ n: 'id', v: `animeButton${makeButtonId(title)}` },
        { n: 'href', v: searchUrl }, { n: 'target', v: "_blank" }, { n: 'title', v: title }]);

        if (isStock) {
            button.className += ' stockButton';
        }
        button.appendChild(buttImg);
        return button;
    }

    //Set buttons with information
    var malSearchUrl;
    var alSearchUrl;
    var apSearchUrl;
    var ytSearchUrl;
    var gSearchUrl;
    var nySearchUrl;
    var kaSearchUrl;

    function setSearchURLs() {
        malSearchUrl = 'http://myanimelist.net/anime.php?q=' + animeName;
        alSearchUrl = 'https://anilist.co/search/anime?search=' + animeName + '&sort=SEARCH_MATCH';
        apSearchUrl = 'https://www.anime-planet.com/anime/all?name=' + animeName;
        ytSearchUrl = 'https://www.youtube.com/results?search_query=' + animeName + ' trailer';
        gSearchUrl = 'https://google.com/search?tbm=isch&biw=&bih=&gbv=2&q=' + animeName;
        nySearchUrl = 'https://nyaa.si/?f=0&c=0_0&q=' + animeName;
        kaSearchUrl = 'https://kissanime.ru/Search/Anime?keyword=' + animeName;

        return [{ n: malTitle, u: malSearchUrl }, { n: apTitle, u: apSearchUrl }, { n: ytTitle, u: ytSearchUrl },
        { n: gTitle, u: gSearchUrl }, { n: nyTitle, u: nySearchUrl }, { n: kaTitle, u: kaSearchUrl }];
    }

    setSearchURLs();

    //MAL Button
    var icon = null;
    var malTitle = "Search MyAnimeList";

    var malButton = creteButton(icon, malSearchUrl, malTitle, true);


    //Anilist Button
    var alTitle = "Search Anilist";

    var alButton = creteButton(icon, alSearchUrl, alTitle, true);


    //Anime-Planet Button
    var apTitle = "Search Anime-Planet";

    var apButton = creteButton(icon, apSearchUrl, apTitle, true);


    //YouTube Button
    var ytTitle = 'YouTube Trailer';

    var ytButton = creteButton(icon, ytSearchUrl, ytTitle, true);


    //Google Images button
    var gTitle = "Search with Google Images";

    var giButton = creteButton(icon, gSearchUrl, gTitle, true);


    //Nyaa button
    var nyTitle = "Search Nyaa";

    var nyButton = creteButton(icon, nySearchUrl, nyTitle, true);


    //KissAnime button
    var kaTitle = "Search KissAnime";

    var kaButton = creteButton(icon, kaSearchUrl, kaTitle, true);


    //Edit button
    alTitle = "Edit Custom Buttons";

    var arrowButtonImg = createHTMLElement('img', null, 'arrowButton', [{ n: 'src', v: arrowIcon }, { n: 'title', v: alTitle },
    { n: 'style', v: 'width:16px;height:16px;transition: all 0.3s linear 0s;left:-18px;position: relative;' }]);

    var editButtonImg = createHTMLElement('img', null, 'editButton', [{ n: 'src', v: editIcon }, { n: 'title', v: alTitle },
    { n: 'style', v: 'width:16px;height:16px;transition: all 0.3s linear 0s;opacity:0;' }]);

    var editButton = createHTMLElement('div', null, null, [{ n: 'style', v: 'width:16px;height:16px;margin-right:2px;display:inline;' }]);

    if (!autoHide) {
        editButtonImg.style.opacity = '1';
        arrowButtonImg.style.opacity = '0';
    }

    header.addEventListener('mouseover', showEditButton);
    header.addEventListener('mouseout', hideEditButton);

    appendChildren(editButton, [editButtonImg, arrowButtonImg]);

    editButton.addEventListener('click', () => { togglePopup(true); });


    var customButtons = [];
    var customButtonsObj = [];

    if (!(GM_listValues()).includes('setting:buttonsNames')) {
        var values = GM_listValues();
        for (var i = 0; i < values.length; i++) {
            if (!values[i].includes('setting:')) {
                customButtonsObj.push(JSON.parse(GM_getValue(values[i], '{}')));
                GM_deleteValue(values[i]);
            }
        }

        setAnimeButtonsToStorage(customButtonsObj);
    }
    else {
        customButtonsObj = getAnimeButtonsFromStorage();
    }

    customButtonsObj.forEach((b) => {
        customButtons.push(creteButton(b.icon, b.url.replace('ANIMENAME', animeName), b.title));
    });



    //Add Website Buttons
    if (host === apHost) {
        appendButtons([malButton, alButton]);
        getElement('.animeButtons').parentElement.style.top = '6px';
    }
    else if (host === alHost) {
        appendButtons([malButton, apButton]);
        getElement('.animeButtons').parentElement.style.top = '8px';
    }
    else if (host === malHost) {
        appendButtons([apButton, alButton]);
        getElement('.animeButtons').parentElement.style.top = '2px';
    }


    function appendButtons(mainButtonsArray) {
        header.appendChild(document.createTextNode(" "));

        var allButtons = mainButtonsArray.concat([ytButton, giButton, nyButton, kaButton], customButtons, editButton);
        var buttonsDiv = createHTMLElement('div', null, 'animeButtons', [{ n: 'style', v: 'position:relative;transition: all 0.4s cubic-bezier(0.79, 0.88, 0.16, 0.98) 0s;' }]);
        var outerButtonsDiv = createHTMLElement('div', null, null, [{ n: 'style', v: 'display:inline-block;position:relative;overflow:hidden;' }]);

        appendChildren(buttonsDiv, allButtons);
        outerButtonsDiv.appendChild(buttonsDiv);

        allButtons.forEach((b) => {
            if (b.id !== '') {
                hideList.push({
                    bId: b.id,
                    h: 'show'
                });
            }
        });

        header.appendChild(outerButtonsDiv);

        getHideList();
        hideButtons();
        addButtonPopup();
        hideEditButton();
    }




    function getHideList() {
        var hideListNew;
        if ((GM_listValues()).includes('hideList')) {
            hideListNew = GM_getValue('hideList', '[]');
            GM_deleteValue('hideList');
        }
        else {
            hideListNew = GM_getValue('setting:hideList', '[]');
        }

        if (!hideListNew || hideListNew === undefined || hideListNew === 'undefined') {
            hideListNew = '[]';
        }

        concatHideList(JSON.parse(hideListNew));
    }

    function concatHideList(v) {
        v.forEach(b => {
            var item = hideList.find(n => n.bId === b.bId);
            if (item) {
                return Object.assign(item, b);
            }
            hideList.push(b);
        });
    }

    function hideButtons() {
        buttDivLeft = 0;

        hideList.forEach((o) => {
            var button = getElement(`#${o.bId}`);

            if (button) {
                if (o.h === 'show') {
                    button.style.display = '';
                    buttDivLeft++;
                }
                else if (o.h === 'hide') {
                    button.style.display = 'none';
                }
            }
        });
    }

    function makeButtonId(buttonName) {
        var result = 0;
        for (var i = 0; i < buttonName.length; i++) {
            result += buttonName.charCodeAt(i);
        }

        return result * buttonName.charCodeAt(buttonName.length - 1);
    }


    function getPopup() {
        return getElement('.buttonPopup');
    }

    function showEditButton() {
        var editButton = getElement('.editButton');

        if (autoHide) {
            var arrowButton = getElement('.arrowButton');
            var buttonsDiv = getElement('.animeButtons');
            buttonsDiv.style.left = '0%';
            arrowButton.style.opacity = '0';
        }

        editButton.style.opacity = '1';
    }

    function hideEditButton() {
        var editButton = getElement('.editButton');

        if (autoHide) {
            var buttonsDiv = getElement('.animeButtons');
            var arrowButton = getElement('.arrowButton');
            buttonsDiv.style.left = `-${buttDivLeft * 18}px`;
            arrowButton.style.opacity = '1';
        }

        editButton.style.opacity = '0';
    }

    function addAndCancelButtonsHandler(e) {
        var targetEl = e.target;

        if (targetEl.className === 'addButton') {
            addButtonLogic(GM_listValues());
        }
        else if (targetEl.className === 'cancelButton') {
            togglePopup(false);
        }
        else if (targetEl.className === 'deleteButton') {
            GM_deleteValue(getElement('.titleInput').value);
            togglePopup(false);
        }
    }

    function addAndEditTabButtonsHandler(e) {
        var target = e.target;

        if (target.className.includes('Text')) {
            target = e.target.parentElement;
        }

        if (target.className === 'addTab' && target.style.color === 'white') {
            var editTab = target.parentElement.children[1];
            hideTabSection(editTab, target);
        }
        else if (target.className === 'editTab' && target.style.color === 'white') {
            var addTab = target.parentElement.firstElementChild;
            hideTabSection(addTab, target);
        }
    }

    function hideTabSection(toHide, toShow) {
        toHide.style.color = 'white';
        toHide.style.backgroundColor = '#d8d8d8';
        toShow.style.color = 'black';
        toShow.style.backgroundColor = 'white';

        var sectionToHide;
        var sectionToShow;

        if (toHide.className === 'addTab') {
            sectionToHide = getElement('.addSection');
            sectionToShow = getElement('.editSection');
        }
        else {
            sectionToHide = getElement('.editSection');
            sectionToShow = getElement('.addSection');
        }

        sectionToHide.style.opacity = '0';

        setTimeout(() => {
            sectionToHide.style.display = 'none';
            sectionToShow.style.display = 'block';
            setTimeout(() => sectionToShow.style.opacity = '1', 50);
        }, 200);
    }

    function togglePopup(show) {
        var popUp = getPopup();

        if (show) {
            header.removeEventListener('mouseout', hideEditButton);
            popUp.style.opacity = '1';
            popUp.style.top = '50%';
        }
        else {
            header.addEventListener('mouseout', hideEditButton);
            hideEditButton();
            popUp.style.opacity = '0';
            popUp.style.top = '-100%';
        }
    }

    function getAnimeButtonsFromStorage() {
        return JSON.parse(GM_getValue('setting:buttonsNames', '[]'));
    }

    function setAnimeButtonsToStorage(buttonsNames) {
        GM_setValue('setting:buttonsNames', JSON.stringify(buttonsNames));
    }

    function addButtonLogic() {
        var titleField = getElement('.titleInput');
        var searchField = getElement('.URLInput');
        var iconField = getElement('.iconInput');

        var buttonsNames = getAnimeButtonsFromStorage();

        if (titleField.value === '') {
            toggleMsgBox(true, 'Title cannot be empty!');
        }
        else if (searchField.value === '') {
            toggleMsgBox(true, 'Search URL cannot be empty!');
        }
        else if (buttonsNames.find((o) => o.title === titleField.value)) {
            toggleMsgBox(true, 'Button with the same name already exists!');
        }
        else {
            if (iconField.value === '') {
                iconField.value = getIconUrl(searchField.value);
            }

            var newButton = {
                title: titleField.value,
                url: searchField.value,
                icon: iconField.value
            };

            buttonsNames.push(newButton);

            setAnimeButtonsToStorage(buttonsNames);

            toggleMsgBox(true, `Button ${titleField.value} added succsessfully! Reload to see it!`, true);

            hideList.push({ bId: `animeButton${makeButtonId(titleField.value)}`, h: 'show' });
            GM_setValue('setting:hideList', JSON.stringify(hideList));

            titleField.value = '';
            searchField.value = '';
            iconField.value = '';
        }
    }

    function getIconUrl(fromUrl) {
        var regex = /(?:https?:\/\/)(w{0,3}\.?[\s\S]+?\.\w+)\//;
        var result = '';

        if (regex.test(fromUrl)) {
            result = `https://www.google.com/s2/favicons?domain=${fromUrl.match(regex)[1]}`;
        }

        return result;
    }

    function toggleMsgBox(toggle, msg, showReload) {
        var msgBox = getElement('.addMsgBox');

        if (msg) {
            msgBox.firstElementChild.textContent = msg;
        }

        if (showReload) {
            msgBox.children[1].style.display = 'inline';
        }
        else {
            msgBox.children[1].style.display = 'none';
        }

        if (toggle) {
            msgBox.style.opacity = '1';
            msgBox.style.bottom = '15%';
        }
        else {
            msgBox.style.opacity = '0';
            setTimeout(() => { msgBox.style.bottom = '150%'; }, 250);
        }
    }

    function hideAndDeleteHandler(e) {
        var target = e.target;
        var buttParent = target.parentElement;
        var button = getElement(`#${buttParent.className}`);

        if (target.className === "removeButton") {
            button.remove();
            target.parentElement.remove();
            var buttonsObjs = getAnimeButtonsFromStorage();
            buttonsObjs = buttonsObjs.filter((o) => buttParent.textContent !== o.title);
            setAnimeButtonsToStorage(buttonsObjs);
            hideList = hideList.filter(obj => obj.bId !== button.id);

            GM_setValue('setting:hideList', JSON.stringify(hideList));
        }
        else if (target.className === 'hideButton') {
            if (button.style.display === 'none') {
                button.style.display = '';
                concatHideList([{ bId: button.id, h: 'show' }]);
                target.setAttribute('src', iconEye);
            }
            else {
                button.style.display = 'none';
                concatHideList([{ bId: button.id, h: 'hide' }]);
                target.setAttribute('src', iconEyeGray);
            }

            GM_setValue('setting:hideList', JSON.stringify(hideList));

            hideButtons();
        }
    }

    function msgButtonsHandler(e) {
        var target = e.target;

        if (target.className === 'reloadButton') {
            location.reload();
        }
        else if (target.className === 'closeButton') {
            toggleMsgBox(false);
        }
    }

    function settingsHandler(e) {
        var target = e.target;

        if (target.className === 'editCheckbox') {
            autoHide = target.checked;
            GM_setValue('setting:autoHide', autoHide);
        }
    }

    function popupClickHandler(e) {
        if (!e.target.className.includes('infoBox')) {
            var infoBoxes = document.querySelectorAll('.infoBox');
            infoBoxes.forEach(b => {
                if (b.style.opacity === '1') {
                    hideInfoBox(b);
                }
            });
        }
    }

    function URLQuestionmarkHandler(e) {
        showInfoBox(e.target.parentElement.lastElementChild);
        var iconInfoBox = getElement('.iconInfoBox');
        hideInfoBox(iconInfoBox);
    }

    function iconQuestionmarkHandler(e) {
        showInfoBox(e.target.parentElement.lastElementChild);
        var URLInfoBox = getElement('.URLInfoBox');
        hideInfoBox(URLInfoBox);
    }

    function hideInfoBox(infoBox) {
        infoBox.style.opacity = '0';
        setTimeout(() => infoBox.style.display = 'none', 300);
    }

    function showInfoBox(infoBox) {
        infoBox.style.display = 'inline-block';
        setTimeout(() => infoBox.style.opacity = '1', 100);
    }

    function addButtonPopup() {
        var questionmarkIcon = 'https://previews.dropbox.com/p/thumb/AAs9PpoNBbIv4yP0RKqnNKTZEYjDtwtWT-24ZkhGOTR9w-CeCdnwqQFvjYSk4YJM8SPo7Pi85ndYpE5ZsJ85Zysho9UfAcqaVYATZ_2UW-y7JtKdKiu1Y7jmPVb9Gv5fRLw20phAXqhEx7EbC6JsRkBvZ6aujPDiiEg8-X0F41jb-wFJ-DW9vrSMOVGyM4dHIxaQNcuCcESUAc6sCfD9Y7iKR3SVd7tWfcAp9SquCdf6aFTIOVXNASu_jFM35cRNpPOQ-i3kO32mPLs98SGDNjszVPGsCBeUKQE6BKnKMb_PVT7l-rx6C1QY6W_VejIUHOtt7_ID4xuFjgLqGSNRpfC6/p.png?size=2048x1536&size_mode=3';

        var style = 'margin:auto;text-align: center;display:block;margin-bottom: 5px;';
        var popUp = createHTMLElement('div', null, 'buttonPopup', [{ n: 'style', v: 'position:absolute;top:-100%;left:50%;margin-top:-280px;margin-left:-200px;background-color:white;width:400px;height:560px;box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);border-radius: 8px;font-size:medium;z-index:9999;opacity:0;transition: all 0.7s cubic-bezier(0.45, -0.24, 0.43, 1.14) 0s;' }]);

        var tabs = createHTMLElement('div', null, 'popupTabs', [{ n: 'style', v: 'width: 100%;height: 40px;' }]);
        var addTab = createHTMLElement('div', null, 'addTab', [{ n: 'style', v: 'height: 100%;width: 50%;background-color: white;left: 50%;border-top-left-radius: 8px;text-align: center;transition: all 0.2s linear 0s;' }]);
        var textTabsStyle = 'position: relative;top: 11px;font-weight: bold;';
        var addTabText = createHTMLElement('div', 'ADD', 'addTabText', [{ n: 'style', v: textTabsStyle }]);
        addTab.appendChild(addTabText);

        var editTab = createHTMLElement('div', null, 'editTab', [{ n: 'style', v: 'top: -40px;height: 100%;width: 50%;background-color: #d8d8d8;left: 50%;position: relative;border-top-right-radius: 8px;text-align: center;color: white;transition: all 0.2s linear 0s;' }]);
        var editTabText = createHTMLElement('div', 'EDIT', 'editTabText', [{ n: 'style', v: textTabsStyle }]);
        editTab.appendChild(editTabText);

        appendChildren(tabs, [addTab, editTab]);

        var addSection = createHTMLElement('div', null, 'addSection', [{ n: 'style', v: 'height:100%;width:100%;transition: all 0.2s linear 0s;' }]);
        var addSectionTitle = createHTMLElement('h2', 'ADD CUSTOM BUTTON', null, [{ n: 'style', v: style + 'margin-top: 25px' }]);
        var title = createHTMLElement('h3', 'Title', null, [{ n: 'style', v: style + 'margin-top: 20px' }]);
        var titleInput = createHTMLElement('input', null, 'titleInput', [{ n: 'placeholder', v: 'Button title' }, { n: 'style', v: style }]);
        var URLTitle = createHTMLElement('h3', 'Search URL', null, [{ n: 'style', v: style + 'margin-top: 20px' }]);
        var URLQm = createHTMLElement('img', null, 'URLQuestionmark questionmark', [{ n: 'src', v: questionmarkIcon }, { n: 'style', v: 'heaight:16px;width:16px;margin-left:5px;' }]);
        var URLInfoBox = createHTMLElement('div', 'To get the search URL first go the site you want to add and search the term "ANIMENAME" in the search field. Then copy the full URL (including http://) in the field below. (exaple: https://myanimelist.net/search/all?q=ANIMENAME)', 'URLInfoBox infoBox', [{ n: 'style', v: 'width: 90%;display: inline-block;position: absolute;margin-left: 10px;background-color: white;border-radius: 8px;box-shadow: rgba(0,0,0, 0.3) 0px 0px 10px;transition: opacity 0.3s linear;opacity: 0;padding: 10px;font-weight: normal;font-size: medium;' }]);
        appendChildren(URLTitle, [URLQm, URLInfoBox]);
        var URLInput = createHTMLElement('input', null, 'URLInput', [{ n: 'placeholder', v: 'Search URL' }, { n: 'style', v: style + 'width:80%' }]);
        var iconTitle = createHTMLElement('h3', 'Icon URL', null, [{ n: 'style', v: style + 'margin-top: 20px' }]);
        var iconQm = createHTMLElement('img', null, 'iconQuestionmark questionmark', [{ n: 'src', v: questionmarkIcon }, { n: 'style', v: 'heaight:16px;width:16px;margin-left:5px;' }]);
        var iconInfoBox = createHTMLElement('div', null, 'iconInfoBox infoBox', [{ n: 'style', v: 'width: 90%;display: inline-block;position: absolute;margin-left: 10px;background-color: white;border-radius: 8px;box-shadow: rgba(0,0,0, 0.3) 0px 0px 10px;transition: opacity 0.3s linear;opacity: 0;padding: 10px;font-weight: normal;font-size: medium;' }]);
        iconInfoBox.innerHTML = '(<b>Leave empty for automatic icon parse</b>)<br />Link to icon for the button. <br />The easiest way to get it is to copy this link "https://www.google.com/s2/favicons?domain=" and place the website url at the end (example: https://www.google.com/s2/favicons?domain=myanimelist.net).';
        appendChildren(iconTitle, [iconQm, iconInfoBox]);
        var iconInput = createHTMLElement('input', null, 'iconInput', [{ n: 'placeholder', v: 'Icon URL' }, { n: 'style', v: style + 'width:80%' }]);

        var msgBoxDiv = createHTMLElement('div', null, 'addMsgBox', [{ n: 'style', v: 'width: 86%;position: absolute;margin-left: 7%;bottom: 150%;background-color: white;border-radius: 8px;box-shadow: rgba(0,0,0, 0.4) 0px 0px 15px;text-align: center;transition: opacity 0.2s linear;opacity:0' }]);
        var msgText = createHTMLElement('div', 'Button added succsessfully! Reload to see it!', 'addMgsText', [{ n: 'style', v: 'margin: 10px;' }]);
        var reloadButton = createHTMLElement('button', 'RELOAD', 'reloadButton', [{ n: 'style', v: 'margin: 10px;margin-right:0px;width:90px;' }]);
        var closeButton = createHTMLElement('button', 'CLOSE', 'closeButton', [{ n: 'style', v: 'margin: 10px;width:90px;' }]);
        appendChildren(msgBoxDiv, [msgText, reloadButton, closeButton]);

        var buttonsDiv = createHTMLElement('div', null, 'addAndCancelButtons', [{ n: 'style', v: style + 'bottom:10px;position:absolute;width:100%' }]);
        var addButton = createHTMLElement('button', 'ADD', 'addButton', [{ n: 'style', v: 'width:90px;margin:5px' }]);
        var cancelButton = createHTMLElement('button', 'CANCEL', 'cancelButton', [{ n: 'style', v: 'width:90px;margin:5px' }]);

        var editSection = createHTMLElement('div', null, 'editSection', [{ n: 'style', v: 'height:100%;width:100%;display:none;transition: all 0.2s linear 0s;' }]);
        var editSectionTitle = createHTMLElement('h2', 'EDIT CUSTOM BUTTONS', null, [{ n: 'style', v: style + 'margin-top: 25px' }]);
        var animeButtonsList = createHTMLElement('ul', null, 'buttonsList', [{ n: 'style', v: 'list-style: none;margin-top: 25px;padding-left: 40px;overflow: hidden;overflow-y: auto;height: 340px;' }]);
        var animeButtons = document.querySelectorAll('.animeButton');

        var settingsDiv = createHTMLElement('div', null, 'settingsDiv', [{ n: 'style', v: 'padding: 0px 30px;' }]);
        var hideEditCheckbox = createHTMLElement('input', null, 'editCheckbox', [{ n: 'id', v: 'editCheckbox' }, { n: 'type', v: 'checkbox' }, { n: 'value', v: 'editCheckbox' }]);

        if (autoHide) {
            hideEditCheckbox.setAttribute('checked', true);
        }

        var hideEditCheckboxLabel = createHTMLElement('label', 'Auto hide buttons (show on mouseover)', null, [{ n: 'for', v: 'editCheckbox' }, { n: 'style', v: 'padding-left:5px;' }]);
        appendChildren(settingsDiv, [hideEditCheckbox, hideEditCheckboxLabel]);

        var editButtonsDiv = createHTMLElement('div', null, 'addAndCancelButtons', [{ n: 'style', v: style + 'bottom:10px;position:absolute;width:100%' }]);
        var cancelButtonEdit = createHTMLElement('button', 'CLOSE', 'cancelButton', [{ n: 'style', v: 'width:90px;margin:5px' }]);
        editButtonsDiv.appendChild(cancelButtonEdit);

        createAndAppendEditListEntry(animeButtonsList, animeButtons);

        popUp.appendChild(tabs);
        appendChildren(buttonsDiv, [addButton, cancelButton]);
        appendChildren(addSection, [addSectionTitle, title, titleInput, URLTitle, URLInput, iconTitle, iconInput, msgBoxDiv, buttonsDiv]);

        appendChildren(editSection, [editSectionTitle, animeButtonsList, settingsDiv, editButtonsDiv]);

        appendChildren(popUp, [addSection, editSection]);
        var html = getElement('html');
        html.appendChild(popUp);

        buttonsDiv.addEventListener('click', addAndCancelButtonsHandler);
        editButtonsDiv.addEventListener('click', addAndCancelButtonsHandler);
        tabs.addEventListener('click', addAndEditTabButtonsHandler);
        animeButtonsList.addEventListener('click', hideAndDeleteHandler);
        msgBoxDiv.addEventListener('click', msgButtonsHandler);
        settingsDiv.addEventListener('click', settingsHandler);
        URLQm.addEventListener('mouseover', URLQuestionmarkHandler);
        iconQm.addEventListener('mouseover', iconQuestionmarkHandler);
        popUp.addEventListener('click', popupClickHandler);
    }

    function createAndAppendEditListEntry(animeButtonsList, animeButtons) {
        animeButtons.forEach((b) => {
            var listEl = createHTMLElement('li', null, b.id, [{ n: 'style', v: 'width:90%;margin-top:5px;border-bottom-style: inset;border-bottom-width: thin;' }]);
            var imgUrl = b.firstElementChild.getAttribute('src');
            var img = createHTMLElement('img', null, null, [{ n: 'src', v: imgUrl }, { n: 'style', v: 'width: 16px;height: 16px;' }]);
            var hideIcon = createHTMLElement('img', null, 'hideButton', [{ n: 'src', v: iconEye }, { n: 'title', v: 'Toggle Hide' }, { n: 'style', v: 'height:16px;width:16px;position: relative;left: 82%;' }]);
            var removeIcon = createHTMLElement('img', null, 'removeButton', [{ n: 'src', v: 'https://previews.dropbox.com/p/thumb/AAv_J1gX163dhysBBA0GBSGRBMMdRoTT2EVqs_xTg5PdES0EF5geKh9gJg0kCbmtTGSzjkZFZQ6qCVpKFmUKobTWUTYu-t6yYVdWg_ldZE8GBUfXu0NWx3q0RfyeelWLgApIOskJParENLlfHXLyKT_FeTPtESh3rNqWCr-7iY1v_snaIZo5WsajqOSeUoJ3jS6M0_lD_PN410Xv-hUbqlNejWUNJDoWz9nkQdhzLX3bFpErrb75jnys7fwG8NV0YYL-HDOKCOFnh0MCviaq_r-YeioUpcwdxVXv9AnHdgsfGnTSmfVdgY6oG5nk0IOjDfYs_R9-3zcOz5pClF6-9uM6/p.png?fv_content=true&size_mode=5' }, { n: 'title', v: 'DELETE' }, { n: 'style', v: 'height:16px;width:16px;position: relative;left: 85%;' }]);
            var span = createHTMLElement('span', b.getAttribute('title'), null, [{ n: 'style', v: 'margin-left:5px;bottom: 2px;position: relative;right: 16px;' }]);

            if (b.style.display === 'none') {
                hideIcon.setAttribute('src', iconEyeGray);
            }

            appendChildren(listEl, [img, hideIcon, span]);

            if (!b.className.includes('stockButton')) {
                listEl.insertBefore(removeIcon, span);
                span.style.right = '32px';
            }
            animeButtonsList.appendChild(listEl);
        });
    }

    function createHTMLElement(tag, textContent, className, attributes) {
        var element = document.createElement(tag);

        if (className) {
            element.className = className;
        }
        if (textContent) {
            element.textContent = textContent;
        }
        if (attributes) {
            attributes.forEach((a) => {
                element.setAttribute(a.n, a.v);
            });
        }

        return element;
    }

    function appendChildren(element, children) {
        children.forEach((c) => {
            element.appendChild(c);
        });
    }
}
