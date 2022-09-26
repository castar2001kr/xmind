package game;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;






@ServerEndpoint("/game.io.host")
public class SocketServer {

	private static List<Session> sessionUsers = Collections.synchronizedList(new ArrayList<>());
	private static HashMap<Session,Boolean> sessionMap = new HashMap<>();
	
	@OnOpen
	public void handleOpen(Session userSession) {
		
		
		sessionUsers.add(userSession);
		sessionMap.put(userSession, true);
		
		System.out.println("새로운 유저 접속");
	}
	
	@OnMessage
	public void handleMessage(String message) {
		
		JSONParser parser = new JSONParser();
		
		try {
			JSONObject obj = (JSONObject) parser.parse(message);
			
			JSONObject hostsig = (JSONObject) obj.get("header");
			
			if(((Long)(hostsig.get("host")))==1) {
				
				
				Iterator<Session> iter = sessionUsers.iterator();
				
				while(iter.hasNext()) {
					
					Session s = iter.next();
					
					if(sessionMap.get(s))
					s.getAsyncRemote().sendText(message);
					
				}
				
			}
			
			
			
			
			
			
		
			
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			System.out.println("오류...");
		}
		
		
	}
	
	@OnClose
	public void handleClose(Session usersession) {
		
		sessionMap.put(usersession, false);
		
	}
	
	@OnError
	public void handleError(Throwable t) {
		
		t.printStackTrace();
	}
	
}
