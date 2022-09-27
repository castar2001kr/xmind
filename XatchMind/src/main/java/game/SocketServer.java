package game;

import java.io.IOException;
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






@ServerEndpoint("/game.io")
public class SocketServer {

	private static List<Session> hosts = Collections.synchronizedList(new ArrayList<>());
	private static List<Session> clients = Collections.synchronizedList(new ArrayList<>());
	
	
	private static HashMap<Session,Boolean> ClientMap = new HashMap<>();
	private static HashMap<Session,Boolean> HostMap = new HashMap<>();
	
	private static HashMap<Session,Boolean> sessionMap = new HashMap<>();
	
	private static int count = 0;
	
	@OnOpen
	public void handleOpen(Session userSession) {
		
		System.out.println("새로운 유저 접속");
	}
	
	@OnMessage
	public void handleMessage(String message, Session userSession) {
		
		
		JSONParser parser = new JSONParser();
		
		try {
			JSONObject obj = (JSONObject) parser.parse(message);
			
			JSONObject hostsig = (JSONObject) obj.get("header");
			
			System.out.println(obj.get("header"));
			
			if(((Long)(hostsig.get("host")))==1) {
				
				System.out.println("호스트 메시지 전달받음.");
				
				Iterator<Session> iter = clients.iterator();
				
				
					
				while(iter.hasNext()) {
					
					Session s = iter.next();
					
					if(ClientMap.get(s))
					s.getBasicRemote().sendText(message);
					
				}
					
					
				
				
				userSession.getAsyncRemote().sendText("call이다.");
				
				
				
				
				
			}else {
				
				
				if(((Long)(hostsig.get("host")))==0) {
					
					
					ClientMap.put(userSession, true);
					clients.add(userSession);
				}
			}
			
			
			
			
			
			
		
			
		} catch (ParseException | IOException e) {
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
