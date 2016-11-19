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

var https = require('https');
var process = require('process');

const ROOM_ID = process.env['GITTER_BOT_ROOM_ID'];
const ACCESS_TOKEN = process.env['GITTER_BOT_ACCESS_TOKEN'];
const MESSAGE = process.env['GITTER_BOT_MESSAGE'];

// Ensures that the required variables must be defined
['GITTER_BOT_ROOM_ID', 'GITTER_BOT_ACCESS_TOKEN', 'GITTER_BOT_MESSAGE']
  .filter(v => !process.env[v])
  .forEach(v => {
    console.error(`Variable ${v} is not defined`);
    process.exit();
  })

// Create request and send
var request = https.request({
  host: 'api.gitter.im',
  port: 443,
  method: 'POST',
  path: `/v1/rooms/${ROOM_ID}/chatMessages?access_token=${ACCESS_TOKEN}`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

request.write(JSON.stringify({ text: replaceVariables(MESSAGE) }));
request.end();

// Replace ENVIRORMENT VARIABLES, e.g. $PATH$, $GITTER_BOT_MESSAGE$
function replaceVariables(text) {
  var match = text.match(/\$(.*?)\$/g)
  if (match) {
    match.forEach(v => {
      var variableName = v.substring(1, v.length - 1); // Remove '%%'
      text = text.replace(v, process.env[variableName]);
    })
  }
  return text;
}
