import axios from 'axios';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  SonarIssuesSeverity, SonarOWASPTop10, SonarInheritance,
  SonarSANSTop25, SonarSourceSecurity, SonarType, SonarStatus,
} from '../../src/enums';
import Rules, {
  RulesField, RulesFacets,
} from '../../src/resources/rules';

describe('Rules', () => {
  const axiosInstance = axios.create();
  const sandbox = sinon.createSandbox();
  const path = 'rules';

  after(() => {
    sandbox.restore();
  });

  it('should set instance property', () => {
    const init = new Rules(axiosInstance);
    expect(init).to.have.property('instance', axiosInstance);
    expect(init).to.respondTo('repositories');
    expect(init).to.respondTo('search');
    expect(init).to.respondTo('show');
    expect(init).to.respondTo('tags');
    expect(init).to.respondTo('update');
  });

  it('should get correct rules repositories', async () => {
    const stubResult = {
      status: 200,
      data: {
        repositories: [
          { key: 'clirr', name: 'Clirr', language: 'java' },
          { key: 'common-c', name: 'Common SonarQube', language: 'c' },
          { key: 'common-cpp', name: 'Common SonarQube', language: 'cpp' },
          { key: 'common-cs', name: 'Common SonarQube', language: 'cs' },
          { key: 'common-java', name: 'Common SonarQube', language: 'java' },
          { key: 'common-js', name: 'Common SonarQube', language: 'js' },
          { key: 'common-objc', name: 'Common SonarQube', language: 'objc' },
          { key: 'common-php', name: 'Common SonarQube', language: 'php' },
          { key: 'c-cppcheck', name: 'Cppcheck', language: 'c' },
          { key: 'cpp-cppcheck', name: 'Cppcheck', language: 'cpp' },
          { key: 'fb-contrib', name: 'fb-contrib', language: 'java' },
          { key: 'findbugs', name: 'FindBugs', language: 'java' },
          { key: 'fxcop', name: 'FxCop / Code Analysis', language: 'cs' },
          { key: 'resharper-cs', name: 'ReSharper', language: 'cs' },
          { key: 'resharper-vbnet', name: 'ReSharper', language: 'vbnet' },
          { key: 'c', name: 'SonarQube', language: 'c' },
          { key: 'cpp', name: 'SonarQube', language: 'cpp' },
          { key: 'csharpsquid', name: 'SonarQube', language: 'cs' },
          { key: 'javascript', name: 'SonarQube', language: 'js' },
          { key: 'objc', name: 'SonarQube', language: 'objc' },
          { key: 'php', name: 'SonarQube', language: 'php' },
          { key: 'squid', name: 'SonarQube', language: 'java' },
          { key: 'stylecop', name: 'StyleCop', language: 'cs' },
        ],
      },
    };
    const stubGet = sandbox.stub(axiosInstance, 'get').resolves(stubResult);
    const rule = new Rules(axiosInstance);
    const result = await rule.repositories();
    expect(result).to.deep.equal(stubResult);
    expect(stubGet.calledOnceWithExactly(`${path}/repositories`, {
      params: {
        language: undefined,
        q: undefined,
      },
    })).to.equal(true);
    stubGet.restore();
  });

  it('should search for rule', async () => {
    const stubResult = {
      status: 200,
      data: {
        total: 4,
        p: 1,
        ps: 3,
        rules: [{
          key: 'squid:S1067',
          repo: 'squid',
          name: 'Expressions should not be too complex',
          createdAt: '2013-03-27T08:52:40+0100',
          updatedAt: '2013-03-27T08:52:40+0100',
          htmlDesc: "<p>\nThe complexity of an expression is defined by the number of <code>&&</code>, <code>||</code> and <code>condition ? ifTrue : ifFalse</code> operators it contains.\nA single expression's complexity should not become too high to keep the code readable.\n</p>\n\n<p>The following code, with a maximum complexity of 3:</p>\n\n<pre>\nif (condition1 && condition2 && condition3 && condition4) { /* ... */ }  // Non-Compliant\n</pre>\n\n<p>could be refactored into something like:</p>\n\n<pre>\nif (relevantMethodName1() && relevantMethodName2()) { /* ... */ }        // Compliant\n\n/* ... */\n\nprivate boolean relevantMethodName1() {\n  return condition1 && condition2;\n}\n\nprivate boolean relevantMethodName2() {\n  return condition3 && condition4;\n}\n</pre>",
          severity: 'MAJOR',
          status: 'READY',
          internalKey: 'S1067',
          isTemplate: false,
          tags: [],
          sysTags: ['brain-overload'],
          lang: 'java',
          langName: 'Java',
          scope: 'MAIN',
          isExternal: false,
          type: 'CODE_SMELL',
          params: [{
            key: 'max',
            desc: 'Maximum number of allowed conditional operators in an expression',
            defaultValue: '3',
          }],
        }, {
          key: 'squid:ClassCyclomaticComplexity',
          repo: 'squid',
          name: 'Avoid too complex class',
          createdAt: '2013-03-27T08:52:40+0100',
          updatedAt: '2013-03-27T08:52:40+0100',
          htmlDesc: "<p>The Cyclomatic Complexity is measured by the number of (&&, ||)\n\toperators and (if, while, do, for, ?:, catch, switch, case, return,\n\tthrow) statements in the body of a class plus one for each constructor,\n\tmethod (but not getter/setter), static initializer, or instance\n\tinitializer in the class. The last return stament in method, if exists,\n\tis not taken into account.</p>\n<p>\n\tEven when the Cyclomatic Complexity of a class is very high, this\n\tcomplexity might be well distributed among all methods. Nevertheless,\n\tmost of the time, a very complex class is a class which breaks the <a\n\t\thref='http://en.wikipedia.org/wiki/Single_responsibility_principle'>Single\n\t\tResponsibility Principle</a> and which should be re-factored to be split\n\tin several classes.\n</p>",
          severity: 'MAJOR',
          status: 'READY',
          internalKey: 'ClassCyclomaticComplexity',
          isTemplate: false,
          tags: [],
          sysTags: ['brain-overload'],
          lang: 'java',
          langName: 'Java',
          scope: 'MAIN',
          isExternal: false,
          type: 'BUG',
          params: [{
            key: 'max',
            desc: 'Maximum complexity allowed.',
            defaultValue: '200',
          }],
        }, {
          key: 'squid:MethodCyclomaticComplexity',
          repo: 'squid',
          name: 'Methods should not be too complex',
          createdAt: '2013-03-27T08:52:40+0100',
          updatedAt: '2013-03-27T08:52:40+0100',
          htmlDesc: '<p>The Cyclomatic Complexity is measured by the number of\n\t(&amp;&amp;, ||) operators and (if, while, do, for, ?:, catch, switch,\n\tcase, return, throw) statements in the body of a class plus one for\n\teach constructor, method (but not getter/setter), static initializer,\n\tor instance initializer in the class. The last return stament in\n\tmethod, if exists, is not taken into account.</p>\n<p>\n\tEven when the Cyclomatic Complexity of a class is very high, this\n\tcomplexity might be well distributed among all methods. Nevertheless,\n\tmost of the time, a very complex class is a class which breaks the <a\n\t\thref="http://en.wikipedia.org/wiki/Single_responsibility_principle">Single\n\t\tResponsibility Principle</a> and which should be re-factored to be split\n\tin several classes.\n</p>',
          severity: 'MAJOR',
          status: 'READY',
          internalKey: 'MethodCyclomaticComplexity',
          isTemplate: false,
          tags: [],
          sysTags: ['brain-overload'],
          lang: 'java',
          langName: 'Java',
          scope: 'MAIN',
          isExternal: false,
          type: 'VULNERABILITY',
          params: [{
            key: 'max',
            desc: 'Maximum complexity allowed.',
            defaultValue: '10',
          }],
        }, {
          key: 'squid:XPath',
          repo: 'squid',
          name: 'XPath rule',
          createdAt: '2013-03-27T08:52:40+0100',
          updatedAt: '2013-03-27T08:52:40+0100',
          htmlDesc: '<p>\nThis rule allows to define some homemade Java rules with help of an XPath expression.\n</p>\n\n<p>\nIssues are created depending on the return value of the XPath expression. If the XPath expression returns:\n</p>\n<ul>\n <li>a single or list of AST nodes, then a line issue with the given message is created for each node</li>\n <li>a boolean, then a file issue with the given message is created only if the boolean is true</li>\n <li>anything else, no issue is created</li>\n</ul>\n\n<p>\nHere is an example of an XPath expression to log an issue on each if statement : //ifStatement\n</p>',
          severity: 'MAJOR',
          status: 'READY',
          internalKey: 'XPath',
          isTemplate: true,
          tags: [],
          sysTags: [],
          mdNote: '<p>\nThe tree produced by the <code>firstOf()</code> matcher is hard to work with from checks when alternatives are not named.\n</p>\n\n<p>\nConsider the following rule:\n</p>\n\n<pre>\nb.rule(COMPILATION_UNIT).is(\n b.firstOf( /* Non-Compliant */\n "FOO",\n "BAR"));\n</pre>\n\n<p>\nIf, from a check, one wants to forbid the usage of the "BAR" alternative,\nthe easiest option will be to verify that the value of the first token is "BAR",\ni.e. <code>"BAR".equals(compilationUnitNode.getTokenValue())</code>.\n</p>\n\n<p>\nThis is not maintainable, for at least two reasons:\n</p>\n\n<ul>\n <li>The grammar might evolve to also accept "bar" in lowercase, which will break <code>"BAR".equals(...)</code></li>\n <li>The grammar might evolve to optionally accept "hello" before the <code>firstOf()</code>, which will break <code>compilationUnitNode.getTokenValue()</code></li>\n</ul>\n\n<p>\nInstead, it is much better to rewrite the grammar as:\n</p>\n\n<pre>\nb.rule(COMPILATION_UNIT).is(\n firstOf( /* Compliant */\n FOO,\n BAR));\nb.rule(FOO).is("FOO");\nb.rule(BAR).is("BAR");\n</pre>\n\n<p>\nThe same check which forbids "BAR" would be written as: <code>compilationUnitNode.hasDirectChildren(BAR)</code>.\nThis allows both of the previous grammar evolutions to be made without impacting the check at all.\n</p>',
          htmlNote: '&lt;p&gt;<br/>The tree produced by the &lt;code&gt;firstOf()&lt;/code&gt; matcher is hard to work with from checks when alternatives are not named.<br/>&lt;/p&gt;<br/><br/>&lt;p&gt;<br/>Consider the following rule:<br/>&lt;/p&gt;<br/><br/>&lt;pre&gt;<br/>b.rule(COMPILATION_UNIT).is(<br/> b.firstOf( /* Non-Compliant */<br/> &quot;FOO&quot;,<br/> &quot;BAR&quot;));<br/>&lt;/pre&gt;<br/><br/>&lt;p&gt;<br/>If, from a check, one wants to forbid the usage of the &quot;BAR&quot; alternative,<br/>the easiest option will be to verify that the value of the first token is &quot;BAR&quot;,<br/>i.e. &lt;code&gt;&quot;BAR&quot;.equals(compilationUnitNode.getTokenValue())&lt;/code&gt;.<br/>&lt;/p&gt;<br/><br/>&lt;p&gt;<br/>This is not maintainable, for at least two reasons:<br/>&lt;/p&gt;<br/><br/>&lt;ul&gt;<br/> &lt;li&gt;The grammar might evolve to also accept &quot;bar&quot; in lowercase, which will break &lt;code&gt;&quot;BAR&quot;.equals(...)&lt;/code&gt;&lt;/li&gt;<br/> &lt;li&gt;The grammar might evolve to optionally accept &quot;hello&quot; before the &lt;code&gt;firstOf()&lt;/code&gt;, which will break &lt;code&gt;compilationUnitNode.getTokenValue()&lt;/code&gt;&lt;/li&gt;<br/>&lt;/ul&gt;<br/><br/>&lt;p&gt;<br/>Instead, it is much better to rewrite the grammar as:<br/>&lt;/p&gt;<br/><br/>&lt;pre&gt;<br/>b.rule(COMPILATION_UNIT).is(<br/> firstOf( /* Compliant */<br/> FOO,<br/> BAR));<br/>b.rule(FOO).is(&quot;FOO&quot;);<br/>b.rule(BAR).is(&quot;BAR&quot;);<br/>&lt;/pre&gt;<br/><br/>&lt;p&gt;<br/>The same check which forbids &quot;BAR&quot; would be written as: &lt;code&gt;compilationUnitNode.hasDirectChildren(BAR)&lt;/code&gt;.<br/>This allows both of the previous grammar evolutions to be made without impacting the check at all.<br/>&lt;/p&gt;',
          noteLogin: 'eric.hartmann',
          lang: 'java',
          langName: 'Java',
          scope: 'MAIN',
          isExternal: false,
          type: 'CODE_SMELL',
          params: [{
            key: 'xpathQuery',
            desc: 'The XPath query',
            defaultValue: '',
          }, {
            key: 'message',
            desc: 'The violation message',
            defaultValue: 'The XPath expression matches this piece of code',
          }],
        }, {
          key: 'squid:XPath_1369910135',
          repo: 'squid',
          name: 'firstOf() alternatives should be rules or token types',
          createdAt: '2013-05-30T10:35:35+0200',
          updatedAt: '2013-03-27T08:52:40+0100',
          htmlDesc: '<p>\r\nThe tree produced by the <code>firstOf()</code> matcher is hard to work with from checks when alternatives are not named.\r\n</p>\r\n\r\n<p>\r\nConsider the following rule:\r\n</p>\r\n\r\n<pre>\r\nb.rule(COMPILATION_UNIT).is(\r\n b.firstOf( /* Non-Compliant */\r\n "FOO",\r\n "BAR"));\r\n</pre>\r\n\r\n<p>\r\nIf, from a check, one wants to forbid the usage of the "BAR" alternative,\r\nthe easiest option will be to verify that the value of the first token is "BAR",\r\ni.e. <code>"BAR".equals(compilationUnitNode.getTokenValue())</code>.\r\n</p>\r\n\r\n<p>\r\nThis is not maintainable, for at least two reasons:\r\n</p>\r\n\r\n<ul>\r\n <li>The grammar might evolve to also accept "bar" in lowercase, which will break <code>"BAR".equals(...)</code></li>\r\n <li>The grammar might evolve to optionally accept "hello" before the <code>firstOf()</code>, which will break <code>compilationUnitNode.getTokenValue()</code></li>\r\n</ul>\r\n\r\n<p>\r\nInstead, it is much better to rewrite the grammar as:\r\n</p>\r\n\r\n<pre>\r\nb.rule(COMPILATION_UNIT).is(\r\n firstOf( /* Compliant */\r\n FOO,\r\n BAR));\r\nb.rule(FOO).is("FOO");\r\nb.rule(BAR).is("BAR");\r\n</pre>\r\n\r\n<p>\r\nThe same check which forbids "BAR" would be written as: <code>compilationUnitNode.hasDirectChildren(BAR)</code>.\r\nThis allows both of the previous grammar evolutions to be made without impacting the check at all.\r\n</p>',
          severity: 'MAJOR',
          status: 'READY',
          internalKey: 'XPath',
          isTemplate: false,
          templateKey: 'squid:XPath',
          tags: [],
          sysTags: [],
          lang: 'java',
          langName: 'Java',
          scope: 'MAIN',
          isExternal: false,
          type: 'CODE_SMELL',
          params: [{
            key: 'xpathQuery',
            desc: 'The XPath query',
            defaultValue: "//expression[primary/qualifiedIdentifier[count(IDENTIFIER) = 2]/IDENTIFIER[2]/@tokenValue = 'firstOf' and primary/identifierSuffix/arguments/expression[not(primary) or primary[not(qualifiedIdentifier) or identifierSuffix]]]",
          }, {
            key: 'message',
            desc: 'The violation message',
            defaultValue: 'Refactor this firstOf() to only use a rule or token type for each alternative.',
          }],
        }],
        actives: {
          'squid:MethodCyclomaticComplexity': [{
            qProfile: 'Sonar way with Findbugs:java',
            inherit: 'NONE',
            severity: 'MAJOR',
            params: [{
              key: 'max',
              value: '10',
            }],
          }, {
            qProfile: 'Sonar way:java',
            inherit: 'NONE',
            severity: 'MAJOR',
            params: [{
              key: 'max',
              value: '10',
            }],
          }],
          'squid:S1067': [{
            qProfile: 'Sonar way with Findbugs:java',
            inherit: 'NONE',
            severity: 'MAJOR',
            params: [{
              key: 'max',
              value: '3',
            }],
          }, {
            qProfile: 'Sonar way:java',
            inherit: 'NONE',
            severity: 'MAJOR',
            params: [{
              key: 'max',
              value: '3',
            }],
          }],
          'squid:ClassCyclomaticComplexity': [{
            qProfile: 'Sonar way with Findbugs:java',
            inherit: 'NONE',
            severity: 'MAJOR',
            params: [{
              key: 'max',
              value: '200',
            }],
          }, {
            qProfile: 'Sonar way:java',
            inherit: 'NONE',
            severity: 'MAJOR',
            params: [{
              key: 'max',
              value: '200',
            }],
          }],
        },
        facets: [{
          name: 'tags',
          values: [{
            val: 'complexity',
            count: 141,
          }, {
            val: 'java8',
            count: 42,
          }, {
            val: 'javadoc',
            count: 13,
          }],
        }, {
          name: 'languages',
          values: [{
            val: 'java',
            count: 563,
          }],
        }, {
          name: 'repositories',
          values: [{
            val: 'findbugs',
            count: 419,
          }, {
            val: 'squid',
            count: 138,
          }, {
            val: 'common-java',
            count: 6,
          }],
        }],
      },
    };
    const stubGet = sandbox.stub(axiosInstance, 'get').resolves(stubResult);
    const rule = new Rules(axiosInstance);
    // Minimal search parameter.
    const result = await rule.search();
    expect(result).to.deep.equal(stubResult);
    expect(stubGet.calledOnceWithExactly(`${path}/search`, {
      params: {
        activation: undefined,
        active_severities: undefined,
        available_since: undefined,
        cwe: undefined,
        f: undefined,
        facets: undefined,
        inheritance: undefined,
        is_template: undefined,
        languages: undefined,
        organization: undefined,
        owaspTop10: undefined,
        q: undefined,
        qprofile: undefined,
        repositories: undefined,
        rule_key: undefined,
        rule_keys: undefined,
        s: undefined,
        sansTop25: undefined,
        severities: undefined,
        sonarsourceSecurity: undefined,
        statuses: undefined,
        tags: undefined,
        template_key: undefined,
        types: undefined,
        asc: true,
        include_external: false,
        p: 1,
        ps: 100,
      },
    })).to.equal(true);
    // Multiple params process.
    const nextResult = await rule.search(
      undefined,
      [SonarIssuesSeverity.info],
      undefined,
      ['12', '125', 'unknown'],
      [RulesField.actives],
      [RulesFacets.true],
      [SonarInheritance.none],
      undefined,
      ['java'],
      undefined,
      [SonarOWASPTop10.a1],
      undefined,
      undefined,
      ['checkstyle', 'findbugs'],
      undefined,
      ['squid:S1002', 'squid:S1003'],
      undefined,
      [SonarSANSTop25.porousDefenses],
      [SonarIssuesSeverity.info],
      [SonarSourceSecurity.auth],
      [SonarStatus.ready],
      ['security', 'java8'],
      undefined,
      [SonarType.bug],
    );
    expect(nextResult).to.deep.equal(stubResult);
    expect(stubGet.calledWith(`${path}/search`, {
      params: {
        activation: undefined,
        active_severities: SonarIssuesSeverity.info,
        available_since: undefined,
        cwe: '12,125,unknown',
        f: RulesField.actives,
        facets: RulesFacets.true,
        inheritance: SonarInheritance.none,
        is_template: undefined,
        languages: 'java',
        organization: undefined,
        owaspTop10: SonarOWASPTop10.a1,
        q: undefined,
        qprofile: undefined,
        repositories: 'checkstyle,findbugs',
        rule_key: undefined,
        rule_keys: 'squid:S1002,squid:S1003',
        s: undefined,
        sansTop25: SonarSANSTop25.porousDefenses,
        severities: SonarIssuesSeverity.info,
        sonarsourceSecurity: SonarSourceSecurity.auth,
        statuses: SonarStatus.ready,
        tags: 'security,java8',
        template_key: undefined,
        types: SonarType.bug,
        asc: true,
        include_external: false,
        p: 1,
        ps: 100,
      },
    })).to.equal(true);
    stubGet.restore();
  });

  it('should get correct show url', async () => {
    const stubResult = {
      status: 200,
      data: {
        rule: {
          key: 'squid:ClassCyclomaticComplexity',
          repo: 'squid',
          name: 'Avoid too complex class',
          htmlDesc: "<p>The Cyclomatic Complexity is measured by the number of (&&, ||)\n\toperators and (if, while, do, for, ?:, catch, switch, case, return,\n\tthrow) statements in the body of a class plus one for each constructor,\n\tmethod (but not getter/setter), static initializer, or instance\n\tinitializer in the class. The last return stament in method, if exists,\n\tis not taken into account.</p>\n<p>\n\tEven when the Cyclomatic Complexity of a class is very high, this\n\tcomplexity might be well distributed among all methods. Nevertheless,\n\tmost of the time, a very complex class is a class which breaks the <a\n\t\thref='http://en.wikipedia.org/wiki/Single_responsibility_principle'>Single\n\t\tResponsibility Principle</a> and which should be re-factored to be split\n\tin several classes.\n</p>",
          severity: 'MAJOR',
          status: 'READY',
          internalKey: 'ClassCyclomaticComplexity',
          template: false,
          tags: [],
          sysTags: ['brain-overload'],
          remFnType: 'LINEAR_OFFSET',
          remFnGapMultiplier: '5d',
          remFnBaseEffort: '10h',
          defaultRemFnType: 'LINEAR_OFFSET',
          defaultRemFnGapMultiplier: '6d',
          defaultRemFnBaseEffort: '11h',
          remFnOverloaded: true,
          gapDescription: 'java.S001.effortToFix',
          lang: 'java',
          langName: 'Java',
          scope: 'MAIN',
          isExternal: false,
          type: 'CODE_SMELL',
          params: [{
            key: 'max',
            desc: 'Maximum complexity allowed.',
            defaultValue: '200',
          }],
        },
        actives: [{
          qProfile: 'Sonar way with Findbugs:java',
          inherit: 'NONE',
          severity: 'MAJOR',
          params: [{
            key: 'max',
            value: '200',
          }],
        }, {
          qProfile: 'Sonar way:java',
          inherit: 'NONE',
          severity: 'MAJOR',
          params: [{
            key: 'max',
            value: '200',
          }],
        }],
      },
    };
    const stubGet = sandbox.stub(axiosInstance, 'get').resolves(stubResult);
    const rule = new Rules(axiosInstance);
    const result = await rule.show('js:EmptyBlock', 'my-org');
    expect(result).to.deep.equal(stubResult);
    expect(stubGet.calledOnceWithExactly(`${path}/show`, {
      params: {
        key: 'js:EmptyBlock',
        organization: 'my-org',
        actives: false,
      },
    })).to.equal(true);
    stubGet.restore();
  });

  it('should get correct tags url', async () => {
    const stubResult = {
      status: 200,
      data: {
        tags: ['java8', 'performance', 'security'],
      },
    };
    const stubGet = sandbox.stub(axiosInstance, 'get').resolves(stubResult);
    const rule = new Rules(axiosInstance);
    const result = await rule.tags('my-org');
    expect(result).to.deep.equal(stubResult);
    expect(stubGet.calledOnceWithExactly(`${path}/tags`, {
      params: {
        organization: 'my-org',
        q: undefined,
        ps: 10,
      },
    })).to.equal(true);
    stubGet.restore();
  });

  it('should post correct rule update', async () => {
    const stubResult = {
      status: 200,
      data: {
        rule: {
          key: 'squid:forbidSonar',
          repo: 'squid',
          name: 'forbidSonar',
          createdAt: '2018-06-06T16:09:09+0200',
          htmlDesc: 'Forbid classes with name starting with Sonar',
          mdDesc: 'Forbid classes with name starting with Sonar',
          severity: 'MAJOR',
          status: 'READY',
          isTemplate: false,
          templateKey: 'squid:S3688',
          tags: [],
          sysTags: [],
          lang: 'java',
          langName: 'Java',
          params: [{
            key: 'className',
            htmlDesc: 'Fully qualified name of the forbidden class. Use a regex to forbid a package.',
            defaultValue: '**/Sonar*',
            type: 'STRING',
          }],
          debtOverloaded: false,
          remFnOverloaded: false,
          scope: 'MAIN',
          isExternal: false,
          type: 'CODE_SMELL',
        },
      },
    };
    const stubPost = sandbox.stub(axiosInstance, 'post').resolves(stubResult);
    const rule = new Rules(axiosInstance);
    const result = await rule.update('js:NullCheck', 'my-org');
    expect(result).to.deep.equal(stubResult);
    expect(stubPost.calledOnceWithExactly(`${path}/update`, 'key=js%3ANullCheck&organization=my-org')).to.equal(true);
    const nextResult = await rule.update('js:NullCheck', 'my-org', undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ['java8', 'security']);
    expect(nextResult).to.deep.equal(stubResult);
    expect(stubPost.calledWithExactly(`${path}/update`, 'key=js%3ANullCheck&organization=my-org&tags=java8%2Csecurity')).to.equal(true);
    stubPost.restore();
  });
});
