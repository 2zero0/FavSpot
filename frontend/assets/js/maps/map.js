import { MAP, CURRENT_POSITION, PIN_INFO_WINDOW, MARKERS, CLUSTERER, CLUSTER_OVRELAY, CLUSTER_OVERLAY_CONTENT, $pinContentBox, $pinDetailTitle, $pinDetailCategory, $pinDetailRoadAddressName, $pinDetailAddressName, $pinDetailPhone, $pinContents } from './data.js';
import { markerInfoHoverEvent, markerClickZoomInEvent, markerDetailContentClickEvent, markerInfoClickEvent } from './event.js';

export function displayPinContents(pinInfo, contents, count, nextPageURL) {
    $pinContentBox.display = 'inline-block';

    $pinDetailTitle.innerText = pinInfo.title;
    $pinDetailCategory.innerText = pinInfo.category;
    $pinDetailRoadAddressName.innerText = pinInfo.new_address;
    $pinDetailAddressName.innerText = pinInfo.old_address;
    // $pinDetailPhone.innerText = pinInfo.phone;

    let liEl, userEl, textEl, photoEl;
    contents.forEach(content=> {
        liEl = document.createElement('li');
        liEl.classList.add('pin_content');

        userEl = document.createElement('div');
        textEl = document.createElement('div');
        photoEl = document.createElement('div');

        userEl.innerText = content.user_id;
        textEl.innertText = content.text;
        photoEl.innerHTML = content.photoEl;

        liEl.appendChild(userEl);
        liEl.appendChild(textEl);
        liEl.appendChild(photoEl);

        $pinContents.appendChild(liEl);
    });
    
}

function displayMarker(pin) {
    pin.setMap(MAP);
}

function displayMap(position) {
    MAP.setCenter(position);
}

export function zoomIn() {
    let mapLevel = MAP.getLevel();

    MAP.setLevel(mapLevel - 1);
}

export function zoomInLocation(location) {
    let mapLevel = MAP.getLevel();

    MAP.setLevel(mapLevel - 1);
    MAP.panTo(location);
}

export function closeZoomInLocation(location) {
    MAP.setLevel(4);
    MAP.panTo(location);
}

// 현재 위치 기반 지도 표시
export function displayGeoLocationMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            CURRENT_POSITION.La = lng;
            CURRENT_POSITION.Ma = lat;
            displayMap(CURRENT_POSITION);
        });
        return;
    }
}

// marker 목록 표시
export function displayMarkers() {
    
    let markers = [];

    MARKERS.forEach(function(marker) {
        markerInfoHoverEvent(marker.marker, PIN_INFO_WINDOW);
        markerInfoClickEvent(marker);
        markerClickZoomInEvent(marker.marker);
        markers.push(marker.marker);
    });
    mapRangeSetup(markers);

    CLUSTERER.addMarkers(markers);
}

export function removeAllMarker() {
    MARKERS.forEach(function(marker) {
        marker.marker.setMap(null);
    });

    MARKERS.length = 0;
    CLUSTER_OVRELAY.setMap(null);
    CLUSTER_OVRELAY.setContent(null);
    CLUSTER_OVERLAY_CONTENT.textContent = "";
    CLUSTERER.clear();
}

// pin 목록 기반 지도 범위 설정
export function mapRangeSetup(markers) {

    let bounds = new kakao.maps.LatLngBounds();

    markers.forEach(function(marker) {
        bounds.extend(marker.getPosition());
    });

    MAP.setBounds(bounds);
}

