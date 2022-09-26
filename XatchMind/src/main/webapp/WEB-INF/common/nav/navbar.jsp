<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>



<%-- 세션 처리로 바꾸시오. --%>

<div class="containerofnav">
	<nav class="upper_menu">

		<a class="go_home" href="/">홈페이지</a>
		<div class="auth">

			<% if(session.getAttribute("id")==null){ %>

			<a href="/regist.do" class="go_regist">회원가입</a> 
			
			<a href="/login.do" class="go_login">로그인</a> 
				
			<%}else{ %>	
			
			<%=session.getAttribute("id") %>님 환영합니다.&nbsp;	
			<a href="" class="go_logout">로그아웃</a>
			<%} %>
		</div>



	</nav>
</div>
