import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { OrganizationService } from "../services/organization.service";
import { Organization } from "../models/organization.model";
import { createResponse } from "../utils/utils";
import { BSONError } from "bson";

export class OrganizationController {
    private organizationService: OrganizationService;

    constructor() {
        this.organizationService = new OrganizationService();
    }

    async createOrganization(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return createResponse(res, { status: false, payload: errors.array() })
        }
        const organizationDetails = req.body as Organization;
        const [error, organization] = await this.organizationService.createOrganization(organizationDetails);
        if (error) {
            return createResponse(res, { status: false, payload: error });
        }
        return createResponse(res, { status: true, payload: { organization } });
    }

    async updateOrganization(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return createResponse(res, { status: false, payload: errors.array() })
        }
        const organizationDetails = req.body as Organization;
        const [error, organization] = await this.organizationService.updateOrganization(req.params.organizationId, organizationDetails);
        if (error) {
            return createResponse(res, { status: false, payload: error });
        }
        return createResponse(res, { status: true, payload: { organization } });
    }

    async deleteOrganization(req: Request, res: Response) {
        const [error, organization] = await this.organizationService.deleteOrganization(req.params.organizationId);
        if (error) {
            return createResponse(res, { status: false, payload: error });
        }
        return createResponse(res, { status: true, payload: { organization } });
    }

    async getOrganizations(req: Request, res: Response) {
        const [error, organizations] = await this.organizationService.getOrganizations();
        if (error) {
            let errors = error;
            if (error instanceof BSONError) errors = error.message;
            return createResponse(res, { status: false, payload: errors });
        }
        return createResponse(res, { status: true, payload: organizations });
    }

    async getOrganizationById(req: Request, res: Response) {
        const [error, organization] = await this.organizationService.getOrganizationById(req.params.organizationId);
        if (error) {
            let errors = error;
            if (error instanceof BSONError) errors = error.message;
            return createResponse(res, { status: false, payload: errors });
        }
        return createResponse(res, { status: true, payload: organization });
    }
}


