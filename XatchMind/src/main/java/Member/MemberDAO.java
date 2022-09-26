package Member;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MemberDAO {

	static private MemberDAO SingleTonDAO;
	
	
	private Connection con;
	
	private MemberDAO() {
		
		String url="jdbc:oracle:thin:@localhost:1521/system2";
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
			
			System.out.println("connecting...");
			
			con =DriverManager.getConnection(url,"system","7735");
			
			con.setAutoCommit(false);
			
		
		} catch (ClassNotFoundException | SQLException e) {
			// TODO Auto-generated catch block
		}
		
		
		
	}
	
	public static MemberDAO getInstance() {
		
		if(SingleTonDAO==null) {
			
			SingleTonDAO=new MemberDAO();
		}
		
		return SingleTonDAO;
	}
	
	public boolean save(MemberDTO member) {
		
		MemberDAO dao=getInstance();
		
		PreparedStatement stmt =null;
		
		String sql="INSERT INTO MEMBERINFO (id,password,name,lv,email) VALUES(?,?,?,?,?)";
		
		try {
			
			stmt = dao.con.prepareStatement(sql);
			
			stmt.setString(1, member.getId());
			stmt.setString(2, member.getPwd());
			stmt.setString(3, member.getName());
			stmt.setInt(4, member.getLevel());
			stmt.setString(5, member.getEmail());
			
			
			
			if(stmt.executeUpdate()!=0) {
				
				dao.con.commit();
				
				return true;
				
			}else {
				return false;
			}
			
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			
			if(stmt!=null) {
				
				try {
					stmt.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			
		}
		
		return false;
		
	}
	
	public MemberDTO find(String id) {
		
		ResultSet rs= null;
		
		MemberDAO dao=getInstance();
		
		PreparedStatement stmt =null;
		
		String sql="SELECT * FROM MEMBERINFO WHERE id=?";
		
		try {
			
			stmt = dao.con.prepareStatement(sql);
			stmt.setString(1, id);
			
			
			rs= stmt.executeQuery();
			
			if(rs.next()) {
				
				MemberDTO temp = new MemberDTO();
				
				temp.setId(rs.getString("id"));
				temp.setPwd(rs.getString("password"));
				
				return temp;
				
			}else {
				
				return null;
			}
			
			
			
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			
			if(stmt!=null) {
				
				try {
					
					rs.close();
					stmt.close();
					
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			
			
		}
		
		return null;
		
	
	}
	
	
	
}
