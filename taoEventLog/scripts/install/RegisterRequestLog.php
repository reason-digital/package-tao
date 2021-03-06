<?php
/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016  (original work) Open Assessment Technologies SA;
 *
 * @author Ivan Klimchuk <klimchuk@1pt.com>
 */

namespace oat\taoEventLog\scripts\install;

use oat\oatbox\extension\AbstractAction;
use common_report_Report;
use oat\oatbox\service\ServiceNotFoundException;
use oat\taoEventLog\model\requestLog\rds\RdsRequestLogStorage;

/**
 * Class RegisterRequestLog
 * @package oat\taoEventLog\scripts\install
 */
class RegisterRequestLog extends AbstractAction
{
    /**
     * @param $params
     * @return common_report_Report
     * @throws \common_Exception
     */
    public function __invoke($params)
    {
        try {
            $storageService = $this->getServiceManager()->get(RdsRequestLogStorage::SERVICE_ID);
        } catch (ServiceNotFoundException $e) {
            $storageService = new RdsRequestLogStorage([RdsRequestLogStorage::OPTION_PERSISTENCE => 'default']);
        }

        RdsRequestLogStorage::install($storageService->getOption(RdsRequestLogStorage::OPTION_PERSISTENCE));

        $this->getServiceManager()->register(RdsRequestLogStorage::SERVICE_ID, $storageService);


        return new common_report_Report(common_report_Report::TYPE_SUCCESS, __('Request log storage successfully created'));
    }
}
