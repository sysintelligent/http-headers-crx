'use strict';

//  Copyright (c) 2016 Christopher Kalafarski.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

var _store = {};

const filter = { urls: ['http://*/*', 'https://*/*'], types: ['main_frame'] };
const rxExtra = ['responseHeaders'];
const txExtra = ['requestHeaders'];

function rxCallback(details) {
  _store[details.tabId].push(details);
}

function txCallback(details) {
  if (!_store.hasOwnProperty(details.tabId) ||
        _store[details.tabId][0].requestId !== details.requestId) {
    _store[details.tabId] = [];
  }

  _store[details.tabId].push(details);
}

chrome.webRequest.onHeadersReceived.addListener(rxCallback, filter, rxExtra);
chrome.webRequest.onSendHeaders.addListener(txCallback, filter, txExtra);
chrome.tabs.onRemoved.addListener(tabId => delete(_store[tabId]));