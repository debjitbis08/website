---
layout: post
title: Generate https redirect URIs when using http in AWS ALB with Spring social
---

Recently, I faced this issue while working with Spring Social and Facebook login where the redirect URI
generated had `http` scheme instead of `https`, which Facebook does not allow. This was happening because
the ALB in front of our application instances where using only `http`. Our architecture is something like

```
-------------        ---------------      -----------      ---------
|           | https  |             | http |         | http |       |
|  Browser  | -----> |  Cloudfront | ---> |   ALB   | ---> |  EC2  |
|           |        |             |      |         |      |       |
-------------        ---------------      -----------      ---------
```

This means only Cloudfront know about SSL and everything downstream is `http`. There are some reasons out of
our control due to which we are stuck with this and is not something we be carrying over to production.

The solution is to somehow send the scheme information from Cloudfront to the tomcat running on EC2. Usually
servers will use headers like `X-Forwarded-Proto` to configure the protocol. This useful when hosted behind
proxies. Unfortunately, Cloudfront does not forward the `X-Forwarded-Proto` header, instead it forward a
custom header, `Cloudfront-Forwarded-Proto` header. So we have to tell tomcat to read this custom header
instead of the standard one. This can be done by configuring the [`RemoteIpValve`](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/valves/RemoteIpValve.html).

```xml
<Valve className="org.apache.catalina.valves.RemoteIpValve"
    protocolHeader="cloudfront-forwarded-proto"/>
```

There are many options in [`RemoteIpValve`](https://tomcat.apache.org/tomcat-9.0-doc/api/org/apache/catalina/valves/RemoteIpValve.html) and I would suggest you to check them out.
