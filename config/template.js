'use strict';

const Joi = require('joi');
const Job = require('./job');
const Regex = require('./regex');

const TEMPLATE_NAMESPACE = Joi
    .string()
    .regex(Regex.TEMPLATE_NAMESPACE)
    .max(64)
    .description('Namespace of the Template')
    .example('node');

// Don't allow slashes in the template name when namespace exists
// Allow one slash in the template name when namespace does not exist
const TEMPLATE_NAME = Joi.alternatives()
    .when('namespace', { is: Joi.exist(),
        then: Joi.string().regex(Regex.TEMPLATE_NAME_NO_SLASH).max(64),
        otherwise: Joi.string().regex(Regex.TEMPLATE_NAME_ALLOW_SLASH).max(64) })
    .description('Name of the Template')
    .example('node/npm-install');

const TEMPLATE_TAG_NAME = Joi
    .string()
    .regex(Regex.TEMPLATE_TAG_NAME)
    .max(30)
    .description('Name of the Template Tag')
    .example('latest');

const TEMPLATE_VERSION = Joi
    .string()
    .regex(Regex.VERSION)
    .max(16)
    .description('Version of the Template')
    .example('1.2');

const TEMPLATE_EXACT_VERSION = Joi
    .string()
    .regex(Regex.EXACT_VERSION)
    .max(16)
    .description('Exact version of the Template')
    .example('1.2.3');

const TEMPLATE_DESCRIPTION = Joi
    .string()
    .max(256)
    .description('Description of the Template')
    .example('Installs npm modules');

const TEMPLATE_MAINTAINER = Joi
    .string()
    .email()
    .max(64)
    .description('Maintainer of the Template')
    .example('foo@bar.com');

const TEMPLATE_IMAGES = Joi.object()
    .pattern(Regex.IMAGE_ALIAS, Job.image)
    .min(1)
    .options({
        language: {
            object: {
                allowUnknown: 'only supports the following characters A-Z,a-z,0-9,-,_'
            }
        }
    });

const SCHEMA_TEMPLATE = Joi.object()
    .keys({
        namespace: TEMPLATE_NAMESPACE,
        name: TEMPLATE_NAME,
        version: TEMPLATE_VERSION,
        description: TEMPLATE_DESCRIPTION,
        maintainer: TEMPLATE_MAINTAINER,
        config: Job.job,
        images: TEMPLATE_IMAGES
    })
    .requiredKeys('name', 'version', 'description', 'maintainer',
        'config', 'config.image', 'config.steps');

/**
 * The definition of the Template pieces
 * @type {Object}
 */
module.exports = {
    template: SCHEMA_TEMPLATE,
    namespace: TEMPLATE_NAMESPACE,
    name: TEMPLATE_NAME,
    templateTag: TEMPLATE_TAG_NAME,
    version: TEMPLATE_VERSION,
    exactVersion: TEMPLATE_EXACT_VERSION,
    description: TEMPLATE_DESCRIPTION,
    maintainer: TEMPLATE_MAINTAINER,
    config: Job.job,
    configNoDupSteps: Job.jobNoDupSteps,
    images: TEMPLATE_IMAGES
};
