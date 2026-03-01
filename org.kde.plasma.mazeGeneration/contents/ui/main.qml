/*
 * Copyright (C) %{CURRENT_YEAR} by %{AUTHOR} <%{EMAIL}>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Library General Public License as
 * published by the Free Software Foundation; either version 2 or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details
 *
 */


import QtQuick
import QtQuick.Layouts
import org.kde.plasma.plasmoid
import "maze.js" as Maze
import org.kde.plasma.core as PlasmaCore

WallpaperItem {
    id: root

    Canvas {
        id: gameCanvas
        anchors.fill: parent
        property int mleft: 0
        property int mtop: 0
        width: parent.width
        height: parent.height

        onPaint: {
            var ctx = getContext("2d");
            Maze.printFrame(ctx, width, height, wallpaper.configuration); 
        }

        onWidthChanged: {
            stepTimer.stop();
            Maze.dimensionChanged(width, height, wallpaper.configuration);
            stepTimer.start();
        }

        onHeightChanged: {
            stepTimer.stop();
            Maze.dimensionChanged(width, height, wallpaper.configuration);
            stepTimer.start();
        }
    }

    Timer {
        id: stepTimer
        interval: wallpaper.configuration.speed
        repeat: true
        running: true
        triggeredOnStart: true

        onTriggered: {
            gameCanvas.mleft++;
            gameCanvas.mtop++;
            Maze.next_frame();
            gameCanvas.requestPaint();
        }
    }

    Component.onCompleted: {
        // Initialize the simulation using the actual dimensions
        Maze.dimensionChanged(width, height, wallpaper.configuration);
    }


}


