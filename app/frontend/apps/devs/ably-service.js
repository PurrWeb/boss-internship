const Ably = require('ably/browser/static/ably-commonjs.js');
import { authenticatedHttp } from './request-api';
import oFetch from 'o-fetch';
import _ from 'lodash';

class AblyService {
	constructor(ablyRealtime, personalChannel, presenceChannel) {
		this.ablyRealtime = ablyRealtime;
		this.active = true;

		const ensureActive = () => {
			if(!this.active){
				throw new Error('Attempt to use inactive service');
			}
		};

		this.deactivate = () => {
			return new Promise((resolve, reject) => {
				ensureActive();

        presenceChannel.presence.leave((err)=> {
					if(err){
						return reject(new Error(`Error leaving channel: ${err}`));
					}

					personalChannel.unsubscribe();

					ablyRealtime.connection.off();
					ablyRealtime.close();

          this.active = false;
					return resolve();
				});
			});
		};

		this.subscribeToPersonalChannel = (onUpdate) => {
			ensureActive();
			personalChannel.subscribe(onUpdate)
		}
	}
}

export function createAblyService(options) {
	const authService = oFetch(options, 'authService');
	const personalChannelName = oFetch(options, 'personalChannelName');
	const presenceChannelName = oFetch(options, 'presenceChannelName');
	const onTokenObtained = options.onTokenObtained || function(){};
	const onRenewTokenFailed = options.onRenewTokenFailed || function(){};
	const onConnected = options.onConnected || function(){};
	const onDisconnected = options.onDisconnected || function(){};
	const onFailed = options.onFailed || function(){};

  let ablyRealtime = new Ably.Realtime({
    authCallback: (tokenParams, callback) => {
      authenticatedHttp(authService).get('/api/security-app/v1/sessions/ably-auth').then(resp => {
				onTokenObtained();
        callback(null, resp.data);
      }).catch((error) => {
        onRenewTokenFailed(error);
      });
    }
  });

  ablyRealtime.connection.on('connected', (resp) => {
		onConnected(resp)
  });

  ablyRealtime.connection.on('disconnected', (resp) => {
		onDisconnected(resp);
  });

  ablyRealtime.connection.on('failed', (resp) => {
		onFailed(resp);
	});

	//private stuff
	let personalChannel = ablyRealtime.channels.get(personalChannelName);
	let presenceChannel = ablyRealtime.channels.get(presenceChannelName);

	return new Promise((resolve, reject) => {
	  presenceChannel.presence.enter('Howdy', (err) => {
			if(err){
				throw new Error(`Entering presence channel failed: ${err}`);
			}
		});
		return resolve(new AblyService(ablyRealtime, personalChannel, presenceChannel));
	});
}

export const ablyErrorCodes = {
	/* generic error codes */
	"10000": "no error",

	/* 400 codes */
	"40000": "bad request",
	"40001": "invalid request body",
	"40002": "invalid parameter name",
	"40003": "invalid parameter value",
	"40004": "invalid header",
	"40005": "invalid credential",
	"40006": "invalid connection id",
	"40007": "invalid message id",
	"40008": "invalid content length",
	"40009": "maximum message length exceeded",
	"40010": "invalid channel name",
	"40011": "stale ring state",
	"40012": "invalid client id",
	"40013": "Invalid message data or encoding",
	"40014": "Resource disposed",
	"40020": "Batch error",

	/* 401 codes */
	"40100": "unauthorized",
	"40101": "invalid credentials",
	"40102": "incompatible credentials",
	"40103": "invalid use of Basic auth over non-TLS transport",
	"40104": "timestamp not current",
	"40105": "nonce value replayed",
	"40110": "account disabled",
	"40111": "account restricted (connection limits exceeded)",
	"40112": "account blocked (message limits exceeded)",
	"40113": "account blocked",
	"40114": "account restricted (channel limits exceeded)",
	"40120": "application disabled",
	"40130": "key error (unspecified)",
	"40131": "key revoked",
	"40132": "key expired",
	"40133": "key disabled",
	"40140": "token error (unspecified)",
	"40141": "token revoked",
	"40142": "token expired",
	"40143": "token unrecognised",
	"40150": "connection blocked (limits exceeded)",
	"40160": "operation not permitted with provided capability",
	"40170": "error from client token callback",

	/* 403 codes */
	"40300": "forbidden",
	"40310": "account does not permit tls connection",
	"40311": "operation requires tls connection",
	"40320": "application requires authentication",

	/* 404 codes */
	"40400": "not found",

	/* 405 codes */
	"40500": "method not allowed",

	/* 500 codes */
	"50000": "internal error",
	"50001": "internal channel error",
	"50002": "internal connection error",
	"50003": "timeout error",
	"50004": "Request failed due to overloaded instance",

	/* reactor-related */
	"70000": "reactor operation failed",
	"70001": "reactor operation failed (post operation failed)",
	"70002": "reactor operation failed (post operation returned unexpected code)",
	"70003": "reactor operation failed (maximum number of concurrent in-flight requests exceeded)",

	/* connection-related */
	"80000": "connection failed",
	"80001": "connection failed (no compatible transport)",
	"80002": "connection suspended",
	"80003": "disconnected",
	"80004": "already connected",
	"80005": "invalid connection id (remote not found)",
	"80006": "unable to recover connection (messages expired)",
	"80007": "unable to recover connection (message limit exceeded)",
	"80008": "unable to recover connection (connection expired)",
	"80009": "connection not established (no transport handle)",
	"80010": "invalid operation (invalid transport handle)",
	"80011": "unable to recover connection (incompatible auth params)",
	"80012": "unable to recover connection (invalid or unspecified connection serial)",
	"80013": "protocol error",
	"80014": "connection timed out",
	"80015": "incompatible connection parameters",
	"80016": "operation on superseded transport",
	"80017": "connection closed",
	"80018": "invalid connection id (invalid format)",
	"80019": "client configured authentication provider request failed",
	"80020": "maximum connection message rate exceeded (publish)",
	"80021": "maximum connection message rate exceeded (subscribe)",
	"80030": "client restriction not satisfied",

	/* channel-related */
	"90000": "channel operation failed",
	"90001": "channel operation failed (invalid channel state)",
	"90002": "channel operation failed (epoch expired or never existed)",
	"90003": "unable to recover channel (messages expired)",
	"90004": "unable to recover channel (message limit exceeded)",
	"90005": "unable to recover channel (no matching epoch)",
	"90006": "unable to recover channel (unbounded request)",
	"90007": "channel operation failed (no response from server)",
	"90010": "maximum number of channels per connection exceeded",
	"91000": "unable to enter presence channel (no clientId)",
	"91001": "unable to enter presence channel (invalid channel state)",
	"91002": "unable to leave presence channel that is not entered",
	"91003": "unable to enter presence channel (maximum member limit exceeded)",
	"91004": "unable to automatically re-enter presence channel",
	"91005": "presence state is out of sync",
	"91100": "member implicitly left presence channel (connection closed)"
}
