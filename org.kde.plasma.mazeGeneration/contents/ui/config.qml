import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

// for "units"
import org.kde.plasma.components as PlasmaComponents
import org.kde.kquickcontrols as KQuickControls
import org.kde.plasma.core as PlasmaCore


ColumnLayout {
    id: root

    property alias cfg_background_color : background_color.color;
    property alias cfg_path_color : path_color.color;
    property alias cfg_possible_tiles_color : possible_tiles_color.color;
    property alias cfg_current_tile_color : current_tile_color.color;
    property alias cfg_tile_scale : tile_scale.value;
    property alias cfg_speed : speed.value;


    RowLayout {
        id: background_color_row
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top

        Label {
            Layout.alignment: Qt.AlignLeft
            text: i18n("Background Color")
        }
        KQuickControls.ColorButton {
            id: background_color
        }
    }

    RowLayout {
        id: possible_path_color_row
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        anchors.topMargin: 45

        Label {
            Layout.alignment: Qt.AlignLeft
            text: i18n("Possible Path Color")
        }
        KQuickControls.ColorButton {
            id: possible_tiles_color
        }
    }

    RowLayout {
        id: path_color_row
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        anchors.topMargin: 90

        Label {
            Layout.alignment: Qt.AlignLeft
            text: i18n("Path Color")
        }
        KQuickControls.ColorButton {
            id: path_color
        }
    }

    RowLayout {
        id: current_tile_row
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        anchors.topMargin: 135

        Label {
            Layout.alignment: Qt.AlignLeft
            text: i18n("Current Tile Color")
        }
        KQuickControls.ColorButton {
            id: current_tile_color
        }
            
    }


    RowLayout {
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        anchors.topMargin: 180

        Label {
            Layout.alignment: Qt.AlignLeft
            text: i18n("Scale (%1)", tile_scale.value)
        }
        Slider {
            id: tile_scale
            from: 3
            value: 15
            to: 45
            stepSize: 1
            Layout.minimumWidth: 300
        }
            
    }


    RowLayout {
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        anchors.topMargin: 225

        Label {
            Layout.alignment: Qt.AlignLeft
            text: i18n("Speed (%1) (seconds)", speed.value / 1000)
        }
        Slider {
            id: speed
            from: 20
            value: 100
            to: 1500
            stepSize: 10
            Layout.minimumWidth: 300
        }
            
    }
    

}