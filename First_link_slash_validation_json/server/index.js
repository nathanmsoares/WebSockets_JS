const WebSocket = require("ws");
const yup = require("yup");
const { object } = require("yup/lib/locale");

/**
 * Collection of "yup" schemas for each event type.
 * @type {Object.<string, yup.Schema>}
*/

const yupEventSchemas =  {
    "PLAYER_MOVEMENT": yup.object().shape({
        x: yup.number().required().integer(),
        y: yup.number().required().integer()
    })
};
/**
 * validates and parses an incoming message to ensure it is in the form of
 * JSON and the schema is ok.
 * 
 * @param {any} message A WebSocket message received from the client
 * @returns {{event: string, payload: object}}
 * @throws Will throw an error if message is invalid
 */

function parseMessage(message){
    const object1 = JSON.parse(message);

    if(!("event" in object1)){
        throw new Error("Event property not provided!");
    }
    if(!("payload" in object1)){
        throw new Error("payload property not provided!");
        return;
    }
    object1.payload = yupEventSchemas[object1.event].validateSync(object1.payload)
    return object1;
}

const wss = new WebSocket.Server({ port:8080 });

wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", message => {
        let data;
        try {
            data = parseMessage(message);
        } catch (err) {
            console.log(`INVALID MESSAGE: ${err.message}`)
        }

        console.log(data);

        switch (data.event) {
            case "PLAYER_MOVEMENT":
                console.log("OK... Receieved player movement");
                break;
        }
    })

    // ws.on("message", data => {
    //     let data ;
    //     console.log(`Client has sent us: ${data}`);

    //     // ws.send(data.toUpperCase());
    // }) 

    ws.on("close", () => {
        console.log("Client closed");
    });
});