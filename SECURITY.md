# Security Policy

## 🔒 Supported Versions

We release patches for security vulnerabilities. Which versions are currently being supported with security updates?

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

## 📋 Reporting a Vulnerability

We take the security of OpenClaw Commander Pro seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

You should report a security vulnerability via email at:

- **Email**: [INSERT YOUR EMAIL HERE]
- **Optional**: Encrypt your message using [Keybase](https://keybase.io/) or PGP

Please include the following information in your report:

- A description of the vulnerability
- Steps to reproduce the issue
- The affected version(s)
- Any potential impact
- If possible, suggestions for addressing the issue

### What to Expect

- **Initial Response**: You should receive an initial response within 48 hours, acknowledging your report.
- **Updates**: We will provide updates every 7 days on the progress of investigating the issue.
- **Resolution**: We aim to resolve critical issues within 30 days of disclosure.

### Disclosure Policy

- We will notify you when the vulnerability has been fixed.
- We may ask you to keep the vulnerability confidential until it is resolved.
- We will credit you for the discovery (unless you prefer to remain anonymous).

## 🛡️ Security Best Practices

### For Users

1. **Keep Dependencies Updated**
   - Regularly update `node_modules` using `npm update`
   - Review security advisories for dependencies

2. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique keys for API tokens

3. **Access Control**
   - Limit file system permissions
   - Use skill permissions appropriately

4. **AI Model Security**
   - Only use trusted AI model sources
   - Validate AI-generated code before execution

### For Contributors

1. **Code Review**
   - All code changes must be reviewed
   - Security-sensitive changes require additional review

2. **Dependency Updates**
   - Keep dependencies up to date
   - Use `npm audit` to check for vulnerabilities

3. **Input Validation**
   - Validate all user inputs
   - Sanitize file paths and commands

4. **Error Handling**
   - Do not expose sensitive information in error messages
   - Log security events appropriately

## 🏆 Security Hall of Fame

We appreciate security researchers and contributors who help us improve the security of OpenClaw Commander Pro.

### Recent Security Contributions

- [Your Name/Handle] - [Vulnerability Type] - [Date]

*To be updated as security contributions are received and resolved*

## 📚 Additional Resources

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/security/)
- [GitHub Security Features](https://docs.github.com/en/code-security)

---

**Thank you for helping keep OpenClaw Commander Pro and our users safe!** 🙏
