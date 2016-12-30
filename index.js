/*
 *  Copyright (C) 2016  leonardosnt
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

'use strict'

function run() {
  // Ensures that all required variables must be defined
  ['GITTER_BOT_ROOM_ID', 'GITTER_BOT_ACCESS_TOKEN', 'GITTER_BOT_MESSAGE']
    .filter(v => !process.env[v])
    .forEach(v => {
      console.error(`Variable ${v} is not defined`);
      process.exit();
    })

   var https = require('https');

  var roomId = process.env['GITTER_BOT_ROOM_ID'];
  var accessToken = process.env['GITTER_BOT_ACCESS_TOKEN'];
  var message = process.env['GITTER_BOT_MESSAGE'];

  // Create request and send
  var request = https.request({
    host: 'api.gitter.im',
    port: 443,
    method: 'POST',
    path: `/v1/rooms/${roomId}/chatMessages?access_token=${accessToken}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  request.write(JSON.stringify({ text: replaceVariables(message) }));
  request.end();

  // Replace ENVIRONMENT VARIABLES, e.g. $PATH$, $GITTER_BOT_MESSAGE$
  function replaceVariables(text) {
    return text.replace(/(\$(.*?)\$)/g, function (match, variable, variableName) {
      var variableValue = process.env[variableName];
      if (variableValue) {
        return variableValue;
      }
      return match;
    });
  }
}

module.exports = { run };