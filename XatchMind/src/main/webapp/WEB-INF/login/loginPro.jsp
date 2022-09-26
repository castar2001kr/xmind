<%@page import="Member.MemberService"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

<jsp:useBean id="member" class="Member.MemberDTO" scope="page" />
	<jsp:setProperty property="id" name="member" />
	<jsp:setProperty property="pwd" name="member" />

<% MemberService service = MemberService.getInstance();
	
	boolean result = service.login(member);
	
	if(result){
		session.setAttribute("id", member.getId());
	}

%>



<jsp:forward page="/WEB-INF/home/index.jsp"></jsp:forward>

</body>
</html>